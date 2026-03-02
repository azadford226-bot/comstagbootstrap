#!/bin/bash
# Unified build script for both frontend and backend
set -e

echo "=== Building Comestag Unified Application ==="

# Step 1: Build frontend
echo ""
echo "Step 1: Building frontend..."
./build-frontend.sh

# Step 2: Build backend
echo ""
echo "Step 2: Building backend..."
mvn clean package -DskipTests

echo ""
echo "=== Build Complete ==="
echo "JAR file location: target/comestag-0.0.1-SNAPSHOT.jar"


