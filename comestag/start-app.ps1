# Start Application Script
# This script starts the Comestag application with all required environment variables

Write-Host "`n=== Starting Comestag Application ===" -ForegroundColor Cyan
Write-Host ""

# Stop any existing Java processes
Write-Host "Stopping existing Java processes..." -ForegroundColor Yellow
Get-Process -Name "java" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
Write-Host "[OK] Stopped" -ForegroundColor Green

# Set environment variables
Write-Host "`nSetting environment variables..." -ForegroundColor Yellow
$env:SPRING_PROFILES_ACTIVE = "local"
$env:SPRING_DATASOURCE_URL = "jdbc:postgresql://localhost:5432/comestag"
$env:SPRING_DATASOURCE_USERNAME = "comestag"
$env:SPRING_DATASOURCE_PASSWORD = "comestag"
$env:APP_SECURITY_JWT_SECRET = "local-dev-jwt-secret-change-in-production-min-32-chars"
$env:VERIFICATION_CODE_SECRET = "local-dev-verification-secret-change-in-production"
$env:AUTH_TOKEN_USER_SECRET_KEY = "local-dev-auth-token-secret-change-in-production"
$env:MAIL_USERNAME = "test@test.com"
$env:MAIL_PASSWORD = "test"
$env:SUPABASE_URL = "https://msnkhkvbexvrxykizidz.supabase.co"
$env:RATE_LIMIT_ENABLED = "false"

Write-Host "[OK] Environment variables set" -ForegroundColor Green

# Check if JAR exists
if (-not (Test-Path "target\comestag-0.0.1-SNAPSHOT.jar")) {
    Write-Host "`n[ERROR] JAR file not found!" -ForegroundColor Red
    Write-Host "  Run: .\build-all.ps1" -ForegroundColor Yellow
    exit 1
}

# Start the application
Write-Host "`nStarting application..." -ForegroundColor Yellow
Write-Host "  JAR: target\comestag-0.0.1-SNAPSHOT.jar" -ForegroundColor Gray
Write-Host "  Port: 3000" -ForegroundColor Gray
Write-Host "  Profile: local" -ForegroundColor Gray
Write-Host "`nApplication will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "`nWatch for 'Started ComestagApplication' message" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop" -ForegroundColor Gray
Write-Host "`n" + ("=" * 60) -ForegroundColor DarkGray
Write-Host ""

# Start the application (this will show all output)
java -jar target\comestag-0.0.1-SNAPSHOT.jar
