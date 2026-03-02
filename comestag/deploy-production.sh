#!/bin/bash

# Production Deployment Script
# Usage: ./deploy-production.sh [environment]

set -e

ENVIRONMENT=${1:-prod}
JAR_NAME="comestag-0.0.1-SNAPSHOT.jar"
BUILD_DIR="target"

echo "🚀 Starting production deployment for environment: $ENVIRONMENT"

# Check prerequisites
echo "📋 Checking prerequisites..."
command -v java >/dev/null 2>&1 || { echo "❌ Java is required but not installed. Aborting." >&2; exit 1; }
command -v mvn >/dev/null 2>&1 || { echo "❌ Maven is required but not installed. Aborting." >&2; exit 1; }
command -v pnpm >/dev/null 2>&1 || { echo "❌ pnpm is required but not installed. Aborting." >&2; exit 1; }

# Build frontend
echo "🏗️  Building frontend..."
cd frontend
pnpm install
pnpm build
cd ..

# Build backend
echo "🏗️  Building backend..."
mvn clean package -DskipTests

# Check if JAR exists
if [ ! -f "$BUILD_DIR/$JAR_NAME" ]; then
    echo "❌ Build failed: JAR not found at $BUILD_DIR/$JAR_NAME"
    exit 1
fi

echo "✅ Build successful!"
echo "📦 JAR location: $BUILD_DIR/$JAR_NAME"
echo ""
echo "📝 Next steps:"
echo "1. Set all required environment variables (see PRODUCTION_ENV_VARIABLES.md)"
echo "2. Ensure PostgreSQL database is set up"
echo "3. Run: java -jar $BUILD_DIR/$JAR_NAME"
echo ""
echo "For detailed deployment instructions, see DEPLOYMENT_GUIDE.md"
