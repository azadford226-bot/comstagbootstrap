# Unified build script for both frontend and backend
$ErrorActionPreference = "Stop"

# Get the script directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

Write-Host "=== Building Comestag Unified Application ===" -ForegroundColor Cyan

# Step 1: Build frontend
Write-Host ""
Write-Host "Step 1: Building frontend..." -ForegroundColor Yellow
& "$ScriptDir\build-frontend.ps1"

# Step 2: Build backend
Write-Host ""
Write-Host "Step 2: Building backend..." -ForegroundColor Yellow
if (Test-Path "mvnw.cmd") {
    .\mvnw.cmd clean package "-DskipTests" "-Dmaven.test.skip=true"
} elseif (Test-Path "mvnw") {
    .\mvnw clean package "-DskipTests" "-Dmaven.test.skip=true"
} elseif (Get-Command mvn -ErrorAction SilentlyContinue) {
    mvn clean package "-DskipTests" "-Dmaven.test.skip=true"
} else {
    Write-Host "Error: Maven not found. Please install Maven or use Maven wrapper." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=== Build Complete ===" -ForegroundColor Green
Write-Host "JAR file location: target/comestag-0.0.1-SNAPSHOT.jar" -ForegroundColor Green

