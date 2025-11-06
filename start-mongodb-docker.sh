#!/bin/bash

# Script to start MongoDB using Docker
# This is the easiest way to run MongoDB without system installation

echo "🚀 Starting MongoDB with Docker..."

# Check if container already exists
if docker ps -a | grep -q appointment-mongodb; then
    echo "📦 MongoDB container exists. Starting it..."
    docker start appointment-mongodb
else
    echo "📦 Creating new MongoDB container..."
    docker run -d \
        --name appointment-mongodb \
        -p 27017:27017 \
        -v appointment-data:/data/db \
        mongo:latest
fi

# Wait for MongoDB to be ready
echo "⏳ Waiting for MongoDB to be ready..."
sleep 3

# Check if MongoDB is running
if docker ps | grep -q appointment-mongodb; then
    echo "✅ MongoDB is running on port 27017!"
    echo ""
    echo "Now you can start the backend:"
    echo "  cd /home/ilya/Desktop/appointment_mangement/backend"
    echo "  npm start"
else
    echo "❌ Failed to start MongoDB"
    echo ""
    echo "You may need to run with sudo:"
    echo "  sudo bash start-mongodb-docker.sh"
fi

