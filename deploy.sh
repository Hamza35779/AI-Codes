#!/bin/bash

set -e

echo "=== Hardware Store Deployment Script ==="
echo ""

# Check if .env.prod exists
if [ ! -f .env.prod ]; then
    echo "Error: .env.prod file not found!"
    echo "Please copy .env.prod.example to .env.prod and configure it."
    exit 1
fi

# Load environment variables
export $(cat .env.prod | grep -v '^#' | xargs)

echo "1. Pulling latest changes..."
git pull origin main

echo "2. Building Docker images..."
docker-compose -f docker-compose.prod.yml build

echo "3. Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down || true

echo "4. Starting new containers..."
docker-compose -f docker-compose.prod.yml up -d

echo "5. Waiting for services to be ready..."
sleep 10

echo "6. Running database migrations..."
docker-compose -f docker-compose.prod.yml exec -T backend npx sequelize-cli db:migrate

echo "7. Checking service health..."
curl -f http://localhost/health || {
    echo "Health check failed!"
    exit 1
}

echo "8. Cleaning up old Docker images..."
docker system prune -f

echo ""
echo "=== Deployment Complete! ==="
echo "Frontend: https://hardware-store.pk"
echo "Backend API: https://hardware-store.pk/api"
echo "Grafana: https://hardware-store.pk:3002"
echo ""
echo "To view logs: docker-compose -f docker-compose.prod.yml logs -f"
