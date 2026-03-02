# Production Deployment Script for Windows
# Usage: .\deploy-production.ps1 [environment]

param(
    [string]$Environment = "prod"
)

$ErrorActionPreference = "Stop"

Write-Host "Starting production deployment for environment: $Environment" -ForegroundColor Cyan

# Check prerequisites
Write-Host "`nChecking prerequisites..." -ForegroundColor Yellow

$javaCheck = Get-Command java -ErrorAction SilentlyContinue
if ($javaCheck) {
    Write-Host "[OK] Java found" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Java is required but not installed. Aborting." -ForegroundColor Red
    exit 1
}

if (Test-Path ".\mvnw.cmd") {
    Write-Host "[OK] Maven wrapper found" -ForegroundColor Green
} else {
    $mvnCheck = Get-Command mvn -ErrorAction SilentlyContinue
    if ($mvnCheck) {
        Write-Host "[OK] Maven found" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] Maven is required but not installed. Aborting." -ForegroundColor Red
        exit 1
    }
}

$pnpmCheck = Get-Command pnpm -ErrorAction SilentlyContinue
if ($pnpmCheck) {
    Write-Host "[OK] pnpm found" -ForegroundColor Green
    $usePnpm = $true
} else {
    $npmCheck = Get-Command npm -ErrorAction SilentlyContinue
    if ($npmCheck) {
        Write-Host "[WARNING] pnpm not found, but npm is available" -ForegroundColor Yellow
        Write-Host "Installing pnpm globally..." -ForegroundColor Yellow
        npm install -g pnpm
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[OK] pnpm installed successfully" -ForegroundColor Green
            $usePnpm = $true
        } else {
            Write-Host "[ERROR] Failed to install pnpm. Please install manually: npm install -g pnpm" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "[ERROR] Neither pnpm nor npm found. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
        exit 1
    }
}

# Build frontend
Write-Host "`nBuilding frontend..." -ForegroundColor Yellow
Set-Location frontend
if ($usePnpm) {
    pnpm install
    pnpm build
} else {
    npm install
    npm run build
}
Set-Location ..

# Build backend
Write-Host "`nBuilding backend..." -ForegroundColor Yellow
.\mvnw.cmd clean package -DskipTests

# Check if JAR exists
$jarPath = "target\comestag-0.0.1-SNAPSHOT.jar"
if (-not (Test-Path $jarPath)) {
    Write-Host "`n[ERROR] Build failed: JAR not found at $jarPath" -ForegroundColor Red
    exit 1
}

Write-Host "`n[SUCCESS] Build successful!" -ForegroundColor Green
Write-Host "JAR location: $jarPath" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Set all required environment variables (see PRODUCTION_ENV_VARIABLES.md)" -ForegroundColor White
Write-Host "2. Ensure PostgreSQL database is set up" -ForegroundColor White
Write-Host "3. Run: java -jar $jarPath" -ForegroundColor White
Write-Host ""
Write-Host "For detailed deployment instructions, see DEPLOYMENT_GUIDE.md" -ForegroundColor Gray
