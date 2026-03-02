# PowerShell build script for frontend
# This script builds the Next.js frontend and copies output to Spring Boot static resources

$ErrorActionPreference = "Stop"

# Get the script directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

$FRONTEND_DIR = "frontend"
$STATIC_DIR = "src/main/resources/static"

Write-Host "Building Next.js frontend..." -ForegroundColor Green

Set-Location $FRONTEND_DIR

# Install dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    if (Get-Command pnpm -ErrorAction SilentlyContinue) {
        pnpm install
    } elseif (Get-Command npm -ErrorAction SilentlyContinue) {
        npm install
    } else {
        Write-Host "Error: Neither pnpm nor npm found. Please install Node.js package manager." -ForegroundColor Red
        exit 1
    }
}

# Build Next.js
Write-Host "Building Next.js application..." -ForegroundColor Yellow

# Ensure NEXT_PUBLIC_DEV_MODE is set from .env.local if it exists
if (Test-Path ".env.local") {
    $envContent = Get-Content ".env.local" -Raw
    if ($envContent -match "NEXT_PUBLIC_DEV_MODE\s*=\s*(.+)") {
        $devModeValue = $matches[1].Trim()
        $env:NEXT_PUBLIC_DEV_MODE = $devModeValue
        Write-Host "  Using NEXT_PUBLIC_DEV_MODE=$devModeValue from .env.local" -ForegroundColor Gray
    }
}

if (Get-Command pnpm -ErrorAction SilentlyContinue) {
    pnpm build
} else {
    npm run build
}

Set-Location ..

# Create static directory if it doesn't exist
if (-not (Test-Path $STATIC_DIR)) {
    New-Item -ItemType Directory -Path $STATIC_DIR -Force | Out-Null
}

# Copy Next.js build output
if (Test-Path "$FRONTEND_DIR\.next") {
    Write-Host "Copying Next.js build output to static resources..." -ForegroundColor Yellow
    
    # For standalone mode, static files are in .next/standalone/.next/static
    if (Test-Path "$FRONTEND_DIR\.next\standalone\.next\static") {
        Write-Host "Standalone build detected - copying static files..." -ForegroundColor Yellow
        $targetStaticDir = "$STATIC_DIR\_next\static"
        if (-not (Test-Path $targetStaticDir)) {
            New-Item -ItemType Directory -Path $targetStaticDir -Force | Out-Null
        }
        Copy-Item -Path "$FRONTEND_DIR\.next\standalone\.next\static\*" -Destination $targetStaticDir -Recurse -Force
        
        # Copy public from standalone if it exists
        if (Test-Path "$FRONTEND_DIR\.next\standalone\public") {
            Copy-Item -Path "$FRONTEND_DIR\.next\standalone\public\*" -Destination $STATIC_DIR -Recurse -Force
        }
        
        # Copy server pages for HTML files (for SSR routes)
        if (Test-Path "$FRONTEND_DIR\.next\standalone\.next\server") {
            Write-Host "Copying server pages for HTML generation..." -ForegroundColor Yellow
            # We'll handle this with Spring Boot SPA routing
        }
    } elseif (Test-Path "$FRONTEND_DIR\.next\static") {
        # Regular build mode
        $targetStaticDir = "$STATIC_DIR\_next\static"
        if (-not (Test-Path $targetStaticDir)) {
            New-Item -ItemType Directory -Path $targetStaticDir -Force | Out-Null
        }
        Copy-Item -Path "$FRONTEND_DIR\.next\static\*" -Destination $targetStaticDir -Recurse -Force
    }
    
    # Copy public assets (always from root public folder)
    if (Test-Path "$FRONTEND_DIR\public") {
        Copy-Item -Path "$FRONTEND_DIR\public\*" -Destination $STATIC_DIR -Recurse -Force
    }
    
    # Create a basic index.html for SPA routing (Spring Boot will handle routing)
    # Next.js standalone mode doesn't generate static HTML, so we create a minimal one
    # that Next.js client-side will hydrate
    if (-not (Test-Path "$STATIC_DIR\index.html")) {
        Write-Host "Creating index.html for Next.js hydration..." -ForegroundColor Yellow
        $indexHtml = @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Comestag</title>
    <meta name="description" content="Build your network of suppliers">
    <link rel="icon" href="/favicon.ico">
</head>
<body>
    <div id="__next"></div>
</body>
</html>
"@
        Set-Content -Path "$STATIC_DIR\index.html" -Value $indexHtml
    } else {
        # Ensure existing index.html doesn't have reload() script
        $existingContent = Get-Content "$STATIC_DIR\index.html" -Raw
        if ($existingContent -match "window\.location\.reload\(\)") {
            Write-Host "Removing reload() script from existing index.html..." -ForegroundColor Yellow
            $indexHtml = @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Comestag</title>
    <meta name="description" content="Build your network of suppliers">
    <link rel="icon" href="/favicon.ico">
</head>
<body>
    <div id="__next"></div>
</body>
</html>
"@
            Set-Content -Path "$STATIC_DIR\index.html" -Value $indexHtml
        }
    }
}

# Alternative: if using static export (if configured)
if (Test-Path "$FRONTEND_DIR\out") {
    Write-Host "Copying static export output..." -ForegroundColor Yellow
    Copy-Item -Path "$FRONTEND_DIR\out\*" -Destination $STATIC_DIR -Recurse -Force
}

Write-Host "Frontend build complete! Files copied to $STATIC_DIR" -ForegroundColor Green

