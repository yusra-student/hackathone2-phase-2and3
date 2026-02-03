#!/bin/bash
# Script to build and run the Todo App with Docker

echo "Building and running Todo App with Docker..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker Desktop first."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose is not available. Using 'docker compose' instead..."
    COMPOSE_CMD="docker compose"
else
    COMPOSE_CMD="docker-compose"
fi

# Build and start the services
echo "Building the services..."
$COMPOSE_CMD build

if [ $? -eq 0 ]; then
    echo "Starting the services..."
    $COMPOSE_CMD up -d

    echo ""
    echo "Services are now running:"
    echo "- Frontend: http://localhost:3000"
    echo "- Backend: http://localhost:7860"
    echo "- Database: localhost:5432 (internal use)"
    echo ""
    echo "To view logs: $COMPOSE_CMD logs -f"
    echo "To stop services: $COMPOSE_CMD down"
else
    echo "Build failed. Please check the error messages above."
    exit 1
fi