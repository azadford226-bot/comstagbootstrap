# Quick Start Script for Backend
# Sets required environment variables and starts the backend

Write-Host "Starting Comestag Backend..." -ForegroundColor Cyan
Write-Host ""

# Set profile to local (has default values for development)
$env:SPRING_PROFILES_ACTIVE = "local"

# Set server port to 9090 to match frontend configuration
$env:SERVER_PORT = "9090"

# Set database connection (adjust if needed)
if (-not $env:SPRING_DATASOURCE_URL) {
    $env:SPRING_DATASOURCE_URL = "jdbc:postgresql://localhost:5432/comestag"
}
if (-not $env:SPRING_DATASOURCE_USERNAME) {
    $env:SPRING_DATASOURCE_USERNAME = "comestag"
}
if (-not $env:SPRING_DATASOURCE_PASSWORD) {
    $env:SPRING_DATASOURCE_PASSWORD = "comestag"
}

# Generate random secrets if not set (for local development)
function Generate-RandomSecret {
    $length = 32
    $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/="
    $random = New-Object System.Random
    $secret = ""
    for ($i = 0; $i -lt $length; $i++) {
        $secret += $chars[$random.Next(0, $chars.Length)]
    }
    return $secret
}

if (-not $env:APP_SECURITY_JWT_SECRET) {
    $env:APP_SECURITY_JWT_SECRET = Generate-RandomSecret
    Write-Host "[INFO] Generated APP_SECURITY_JWT_SECRET" -ForegroundColor Yellow
}

if (-not $env:VERIFICATION_CODE_SECRET) {
    $env:VERIFICATION_CODE_SECRET = Generate-RandomSecret
    Write-Host "[INFO] Generated VERIFICATION_CODE_SECRET" -ForegroundColor Yellow
}

if (-not $env:AUTH_TOKEN_USER_SECRET_KEY) {
    $env:AUTH_TOKEN_USER_SECRET_KEY = Generate-RandomSecret
    Write-Host "[INFO] Generated AUTH_TOKEN_USER_SECRET_KEY" -ForegroundColor Yellow
}

# Email configuration (optional for local - can use mock)
if (-not $env:MAIL_USERNAME) {
    $env:MAIL_USERNAME = "test@test.com"
    Write-Host "[INFO] Using default MAIL_USERNAME (emails won't send)" -ForegroundColor Yellow
}
if (-not $env:MAIL_PASSWORD) {
    $env:MAIL_PASSWORD = "test"
    Write-Host "[INFO] Using default MAIL_PASSWORD (emails won't send)" -ForegroundColor Yellow
}

# Supabase (optional for local)
if (-not $env:SUPABASE_URL) {
    $env:SUPABASE_URL = "https://msnkhkvbexvrxykizidz.supabase.co"
}
if (-not $env:SUPABASE_SERVICE_KEY) {
    Write-Host "[WARNING] SUPABASE_SERVICE_KEY not set - media uploads may not work" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Configuration:" -ForegroundColor Cyan
Write-Host "  Profile: $env:SPRING_PROFILES_ACTIVE" -ForegroundColor White
Write-Host "  Port: $env:SERVER_PORT" -ForegroundColor White
Write-Host "  Database: $env:SPRING_DATASOURCE_URL" -ForegroundColor White
Write-Host "  Username: $env:SPRING_DATASOURCE_USERNAME" -ForegroundColor White
Write-Host ""
Write-Host "Starting backend on port $env:SERVER_PORT..." -ForegroundColor Green
Write-Host "Backend will be available at: http://localhost:$env:SERVER_PORT" -ForegroundColor Cyan
Write-Host ""

# Start the backend
java -jar target\comestag-0.0.1-SNAPSHOT.jar
