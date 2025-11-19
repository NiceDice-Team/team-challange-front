#!/bin/bash

# Build script for NiceDice Frontend

echo "🚀 Building NiceDice Frontend Docker Container..."

# Set default environment variables if not provided
export NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL:-http://localhost:8000/api/}

echo "Environment variables:"
echo "NEXT_PUBLIC_BACKEND_URL: $NEXT_PUBLIC_BACKEND_URL"

# Build and run with docker-compose
echo "📦 Building with docker-compose..."
docker-compose up --build -d

echo "✅ Build complete!"
echo "🌐 Frontend should be available at: http://localhost:3000"
echo "📝 Check logs with: docker-compose logs -f frontend"