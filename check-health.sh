#!/bin/bash

# Hardware Store - Deployment Health Check Script
# Run this on your LIVE SERVER to diagnose issues

set -e

echo "========================================="
echo "Hardware Store - Deployment Diagnostics"
echo "========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then
    echo -e "${YELLOW}Warning: Some checks may require root privileges${NC}"
fi

echo "Step 1: Checking system requirements..."
echo "-----------------------------------------"

# Check OS
if [ -f /etc/os-release ]; then
    . /etc/os-release
    echo -e "${GREEN}✓ OS: $PRETTY_NAME${NC}"
else
    echo -e "${RED}✗ Cannot detect OS${NC}"
fi

# Check RAM
RAM=$(free -m | awk '/^Mem:/{print $2}')
if [ "$RAM" -lt 2000 ]; then
    echo -e "${YELLOW}⚠ Low RAM: ${RAM}MB (recommended: 2GB+)${NC}"
else
    echo -e "${GREEN}✓ RAM: ${RAM}MB${NC}"
fi

# Check disk space
DISK=$(df -h / | awk 'NR==2 {print $4}')
echo -e "${GREEN}✓ Available disk space: $DISK${NC}"

echo ""
echo "Step 2: Checking Docker..."
echo "-----------------------------------------"

if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version | awk '{print $3}' | tr -d ',')
    echo -e "${GREEN}✓ Docker installed: $DOCKER_VERSION${NC}"
else
    echo -e "${RED}✗ Docker not installed${NC}"
    echo "  Install with: curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh"
fi

if command -v docker-compose &> /dev/null; then
    COMPOSE_VERSION=$(docker-compose --version | awk '{print $3}' | tr -d ',')
    echo -e "${GREEN}✓ Docker Compose installed: $COMPOSE_VERSION${NC}"
else
    echo -e "${RED}✗ Docker Compose not installed${NC}"
    echo "  Install: sudo curl -L \"https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)\" -o /usr/local/bin/docker-compose && sudo chmod +x /usr/local/bin/docker-compose"
fi

echo ""
echo "Step 3: Checking project files..."
echo "-----------------------------------------"

if [ -d "/opt/hardware-store" ]; then
    echo -e "${GREEN}✓ Project directory exists${NC}"
    cd /opt/hardware-store
    
    if [ -f ".env.prod" ]; then
        echo -e "${GREEN}✓ .env.prod exists${NC}"
        
        # Check for default/unconfigured values
        if grep -q "yourdomain.com" .env.prod 2>/dev/null; then
            echo -e "${RED}✗ .env.prod still has 'yourdomain.com' - PLEASE CONFIGURE!${NC}"
        fi
        if grep -q "CHANGE_THIS" .env.prod 2>/dev/null; then
            echo -e "${RED}✗ .env.prod has CHANGE_THIS values - MUST UPDATE!${NC}"
        fi
    else
        echo -e "${RED}✗ .env.prod not found! Copy from .env.example${NC}"
    fi
    
    if [ -f "docker-compose.prod.yml" ]; then
        echo -e "${GREEN}✓ docker-compose.prod.yml exists${NC}"
    else
        echo -e "${RED}✗ docker-compose.prod.yml not found${NC}"
    fi
else
    echo -e "${RED}✗ Project not found at /opt/hardware-store${NC}"
    echo "  Upload your project files to /opt/hardware-store"
fi

echo ""
echo "Step 4: Checking Docker containers..."
echo "-----------------------------------------"

cd /opt/hardware-store 2>/dev/null || cd ~

if docker-compose -f docker-compose.prod.yml ps &> /dev/null; then
    docker-compose -f docker-compose.prod.yml ps
else
    echo -e "${YELLOW}⚠ No running containers found${NC}"
fi

echo ""
echo "Step 5: Checking network & ports..."
echo "-----------------------------------------"

# Check if ports are in use
for port in 80 443 3000 5432 6379 9200; do
    if netstat -tuln 2>/dev/null | grep -q ":$port "; then
        echo -e "${GREEN}✓ Port $port is in use${NC}"
    else
        echo -e "${YELLOW}⚠ Port $port not in use${NC}"
    fi
done

echo ""
echo "Step 6: Testing services..."
echo "-----------------------------------------"

# Test backend health
if curl -f http://localhost:3000/health &> /dev/null; then
    echo -e "${GREEN}✓ Backend health check passed${NC}"
else
    echo -e "${RED}✗ Backend health check failed${NC}"
    echo "  Check logs: docker-compose -f docker-compose.prod.yml logs backend"
fi

# Test PostgreSQL
if docker-compose -f docker-compose.prod.yml exec -T postgres pg_isready &> /dev/null; then
    echo -e "${GREEN}✓ PostgreSQL is ready${NC}"
else
    echo -e "${RED}✗ PostgreSQL not ready${NC}"
fi

# Test Redis
if docker-compose -f docker-compose.prod.yml exec -T redis redis-cli ping &> /dev/null; then
    echo -e "${GREEN}✓ Redis is responding${NC}"
else
    echo -e "${RED}✗ Redis not responding${NC}"
fi

echo ""
echo "Step 7: SSL Certificate check..."
echo "-----------------------------------------"

if [ -d "/etc/letsencrypt/live" ]; then
    CERT_COUNT=$(ls -1 /etc/letsencrypt/live/ 2>/dev/null | wc -l)
    echo -e "${GREEN}✓ Let's Encrypt certificates found: $CERT_COUNT${NC}"
    
    # Check certificate expiry
    if command -v certbot &> /dev/null; then
        certbot certificates 2>/dev/null | grep -A1 "Domains:" || true
    fi
else
    echo -e "${YELLOW}⚠ No SSL certificates found${NC}"
    echo "  Run: certbot --nginx -d yourdomain.com -d www.yourdomain.com"
fi

echo ""
echo "========================================="
echo "Diagnostics complete!"
echo "========================================="
echo ""
echo "Common issues & fixes:"
echo "1. Backend not starting? Check: docker-compose -f docker-compose.prod.yml logs backend"
echo "2. Database connection failed? Verify DB_PASSWORD in .env.prod"
echo "3. SSL issues? Run: certbot renew --dry-run"
echo "4. Port 80/443 blocked? Check: ufw status"
echo ""
