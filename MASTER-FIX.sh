#!/bin/bash'

# Hardware Store - MASTER Troubleshooting Script
# Run this on your LIVE SERVER as root/sudo

set -e'

echo "========================================="
echo "Hardware Store - Master Fix Script"
echo "========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color'

# Check if running as root
if [ "$EUID" -ne 0 ]; then'
    echo -e "${YELLOW}Warning: Some operations may require root privileges${NC}"
fi'

echo "Step 1: Stopping all containers..."
cd /opt/hardware-store 2>/dev/null || {
    echo -e "${RED}Project not found at /opt/hardware-store${NC}"
    echo "Please upload your project files to /opt/hardware-store"
    exit 1
}'

docker-compose -f docker-compose.prod.yml down || true'
docker-compose -f docker-compose.yml down || true'

echo ""
echo "Step 2: Cleaning up Docker..."
docker system prune -af'
docker volume prune -f'

echo ""
echo "Step 3: Checking .env.prod..."
if [ ! -f ".env.prod" ]; then'
    echo -e "${RED}.env.prod not found!${NC}"
    if [ -f ".env.example" ]; then'
        cp .env.example .env.prod'
        echo -e "${GREEN}Created .env.prod from example${NC}"
    fi'
    echo -e "${RED}YOU MUST EDIT .env.prod with your credentials!${NC}"
    nano .env.prod'
fi'

# Check for placeholder values
if grep -q "yourdomain.com" .env.prod 2>/dev/null; then'
    echo -e "${RED}WARNING: .env.prod still has 'yourdomain.com'${NC}"
    echo "Please update with your actual domain!"
fi'

if grep -q "CHANGE_THIS" .env.prod 2>/dev/null; then'
    echo -e "${RED}WARNING: .env.prod has CHANGE_THIS values!${NC}"
    echo "Please update with actual passwords!"
fi'

echo ""
echo "Step 4: Fixing permissions..."
chmod +x *.sh 2>/dev/null || true'
chown -R $SUDO_USER:$SUDO_USER . 2>/dev/null || true'

echo ""
echo "Step 5: Stopping conflicting services..."
systemctl stop apache2 2>/dev/null || true'
systemctl stop nginx 2>/dev/null || true'

echo ""
echo "Step 6: Checking ports..."
for port in 80 443 3000 5432 6379 9200; do'
    if netstat -tuln 2>/dev/null | grep -q ":$port "; then'
        echo -e "${YELLOW}Port $port is in use${NC}"
        fuser -k "$port/tcp" 2>/dev/null || true'
    fi'
done'

echo ""
echo "Step 7: Rebuilding and starting services..."
docker-compose -f docker-compose.prod.yml build --no-cache'
docker-compose -f docker-compose.prod.yml up -d'

echo ""
echo "Step 8: Waiting for services to start..."
sleep 20'

echo ""
echo "Step 9: Running database migrations..."
docker-compose -f docker-compose.prod.yml exec -T backend npx sequelize-cli db:migrate || {
    echo -e "${YELLOW}Migration failed, but continuing...${NC}"
}'

echo ""
echo "Step 10: Checking service health..."
HEALTH=$(curl -s http://localhost:3000/health || echo "failed")'
if [[ "$HEALTH" == *"OK"* ]]; then'
    echo -e "${GREEN}✓ Backend health check passed${NC}"
else'
    echo -e "${RED}✗ Backend health check failed${NC}"
    echo "Checking backend logs..."
    docker-compose -f docker-compose.prod.yml logs --tail=50 backend'
fi'

echo ""
echo "Step 11: Checking all containers..."
docker-compose -f docker-compose.prod.yml ps'

echo ""
echo "========================================="
echo "Master Fix Complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. If containers are not running, check logs:"
echo "   docker-compose -f docker-compose.prod.yml logs -f"
echo ""
echo "2. Set up SSL certificates:"
echo "   certbot --nginx -d yourdomain.com -d www.yourdomain.com"
echo ""
echo "3. Access your site:"
echo "   https://yourdomain.com"
echo ""
EOF'
chmod +x MASTER-FIX.sh && echo "Created and made executable MASTER-FIX.sh"
