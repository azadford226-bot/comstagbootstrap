# PowerShell script to deploy to Vercel with SSL certificate workaround
# Use this if you're having SSL certificate issues

param(
    [switch]$SkipSSL = $false,
    [string]$BackendUrl = ""
)

Write-Host "=== Vercel Deployment Script ===" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the frontend directory
if (-not (Test-Path "package.json")) {
    Write-Host "Error: Must run from frontend directory" -ForegroundColor Red
    exit 1
}

# Option 1: Skip SSL verification (not recommended for production)
if ($SkipSSL) {
    Write-Host "Warning: SSL certificate verification is disabled" -ForegroundColor Yellow
    Write-Host "This is only recommended for development/testing" -ForegroundColor Yellow
    Write-Host ""
    
    $env:NODE_TLS_REJECT_UNAUTHORIZED = "0"
    Write-Host "SSL verification disabled for this session" -ForegroundColor Green
}

# Check if Vercel CLI is installed
if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
}

Write-Host ""
Write-Host "Recommended: Use GitHub Integration instead of CLI" -ForegroundColor Cyan
Write-Host "1. Push your code to GitHub" -ForegroundColor White
Write-Host "2. Go to https://vercel.com/dashboard" -ForegroundColor White
Write-Host "3. Click 'Add New Project'" -ForegroundColor White
Write-Host "4. Import your repository" -ForegroundColor White
Write-Host "5. Set Root Directory to: comestag/frontend" -ForegroundColor White
Write-Host ""
Write-Host "Press Enter to continue with CLI deployment, or Ctrl+C to cancel..."
Read-Host

# Login to Vercel
Write-Host ""
Write-Host "Logging in to Vercel..." -ForegroundColor Yellow
vercel login

if ($LASTEXITCODE -ne 0) {
    Write-Host "Login failed. Try using GitHub integration instead." -ForegroundColor Red
    exit 1
}

# Deploy
Write-Host ""
Write-Host "Deploying to Vercel..." -ForegroundColor Yellow
vercel

if ($LASTEXITCODE -ne 0) {
    Write-Host "Deployment failed." -ForegroundColor Red
    Write-Host "Consider using GitHub integration instead." -ForegroundColor Yellow
    exit 1
}

# Set environment variables if backend URL provided
if ($BackendUrl) {
    Write-Host ""
    Write-Host "Setting environment variables..." -ForegroundColor Yellow
    Write-Host "NEXT_PUBLIC_API_BASE_URL=$BackendUrl" -ForegroundColor White
    $env:NEXT_PUBLIC_API_BASE_URL = $BackendUrl
    vercel env add NEXT_PUBLIC_API_BASE_URL production
    Write-Host "Enter the backend URL when prompted: $BackendUrl" -ForegroundColor Cyan
    
    Write-Host ""
    Write-Host "Setting NEXT_PUBLIC_DEV_MODE=false" -ForegroundColor White
    vercel env add NEXT_PUBLIC_DEV_MODE production
    Write-Host "Enter 'false' when prompted" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "=== Deployment Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Set environment variables in Vercel dashboard if not done above" -ForegroundColor White
Write-Host "2. Update backend CORS to include your Vercel domain" -ForegroundColor White
Write-Host "3. Deploy to production: vercel --prod" -ForegroundColor White
