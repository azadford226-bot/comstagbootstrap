#!/bin/bash
# Build script for frontend
# This script builds the Next.js frontend and copies output to Spring Boot static resources

set -e

FRONTEND_DIR="frontend"
STATIC_DIR="src/main/resources/static"

echo "Building Next.js frontend..."

cd "$FRONTEND_DIR"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    if command -v pnpm &> /dev/null; then
        pnpm install
    elif command -v npm &> /dev/null; then
        npm install
    else
        echo "Error: Neither pnpm nor npm found. Please install Node.js package manager."
        exit 1
    fi
fi

# Build Next.js
echo "Building Next.js application..."
if command -v pnpm &> /dev/null; then
    pnpm build
else
    npm run build
fi

cd ..

# Create static directory if it doesn't exist
mkdir -p "$STATIC_DIR"

# Copy Next.js build output
# For Next.js standalone output, we need to copy .next/standalone and .next/static
if [ -d "$FRONTEND_DIR/.next" ]; then
    echo "Copying Next.js build output to static resources..."
    
    # Copy static assets
    if [ -d "$FRONTEND_DIR/.next/static" ]; then
        mkdir -p "$STATIC_DIR/_next/static"
        cp -r "$FRONTEND_DIR/.next/static"/* "$STATIC_DIR/_next/static/"
    fi
    
    # Copy public assets
    if [ -d "$FRONTEND_DIR/public" ]; then
        cp -r "$FRONTEND_DIR/public"/* "$STATIC_DIR/"
    fi
    
    # For standalone mode, copy the necessary files
    if [ -d "$FRONTEND_DIR/.next/standalone" ]; then
        # Copy server files if needed (though we'll serve from Spring Boot)
        echo "Standalone build detected - copying necessary files..."
    fi
fi

# Alternative: if using static export (if configured)
if [ -d "$FRONTEND_DIR/out" ]; then
    echo "Copying static export output..."
    cp -r "$FRONTEND_DIR/out"/* "$STATIC_DIR/"
fi

echo "Frontend build complete! Files copied to $STATIC_DIR"


