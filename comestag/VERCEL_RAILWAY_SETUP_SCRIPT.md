# Automated Setup Script (Optional)

If you prefer a script-based approach, here's a PowerShell script to help set up the connection.

## ⚠️ Prerequisites

1. Install Vercel CLI: `npm i -g vercel`
2. Login to Vercel: `vercel login`
3. Have your Railway backend URL ready

## 📝 Script

Save this as `setup-vercel-railway.ps1`:

```powershell
# Setup Vercel + Railway Connection
# Usage: .\setup-vercel-railway.ps1 -RailwayUrl "https://your-app.up.railway.app" -VercelDomain "https://your-app.vercel.app"

param(
    [Parameter(Mandatory=$true)]
    [string]$RailwayUrl,
    
    [Parameter(Mandatory=$true)]
    [string]$VercelDomain
)

Write-Host "🚀 Setting up Vercel + Railway Connection" -ForegroundColor Cyan
Write-Host ""

# Validate URLs
if (-not $RailwayUrl.StartsWith("https://")) {
    Write-Host "❌ Railway URL must start with https://" -ForegroundColor Red
    exit 1
}

if (-not $VercelDomain.StartsWith("https://")) {
    Write-Host "❌ Vercel Domain must start with https://" -ForegroundColor Red
    exit 1
}

Write-Host "📋 Configuration:" -ForegroundColor Yellow
Write-Host "  Railway Backend: $RailwayUrl" -ForegroundColor White
Write-Host "  Vercel Frontend: $VercelDomain" -ForegroundColor White
Write-Host ""

# Step 1: Set Vercel Environment Variable
Write-Host "1️⃣ Setting Vercel environment variable..." -ForegroundColor Cyan
Write-Host "   Variable: NEXT_PUBLIC_API_BASE_URL" -ForegroundColor Gray
Write-Host "   Value: $RailwayUrl" -ForegroundColor Gray
Write-Host ""

$confirm = Read-Host "Continue? (Y/N)"
if ($confirm -ne "Y" -and $confirm -ne "y") {
    Write-Host "Cancelled." -ForegroundColor Yellow
    exit 0
}

# Navigate to frontend directory
$frontendPath = Join-Path $PSScriptRoot "frontend"
if (-not (Test-Path $frontendPath)) {
    Write-Host "❌ Frontend directory not found at: $frontendPath" -ForegroundColor Red
    exit 1
}

Set-Location $frontendPath

# Set environment variables for all environments
Write-Host "   Setting for Production..." -ForegroundColor Gray
$env:NEXT_PUBLIC_API_BASE_URL = $RailwayUrl
vercel env add NEXT_PUBLIC_API_BASE_URL production 2>&1 | Out-Null

Write-Host "   Setting for Preview..." -ForegroundColor Gray
vercel env add NEXT_PUBLIC_API_BASE_URL preview 2>&1 | Out-Null

Write-Host "   Setting for Development..." -ForegroundColor Gray
vercel env add NEXT_PUBLIC_API_BASE_URL development 2>&1 | Out-Null

Write-Host "✅ Vercel environment variable set!" -ForegroundColor Green
Write-Host ""

# Step 2: Instructions for Railway
Write-Host "2️⃣ Railway Configuration (Manual Step Required):" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Go to Railway Dashboard → Your Backend Service → Variables" -ForegroundColor White
Write-Host "   Add the following environment variable:" -ForegroundColor White
Write-Host ""
Write-Host "   Name:  CORS_ALLOWED_ORIGINS" -ForegroundColor Yellow
Write-Host "   Value: $VercelDomain" -ForegroundColor Yellow
Write-Host ""
Write-Host "   Then save and Railway will automatically redeploy." -ForegroundColor White
Write-Host ""

# Step 3: Redeploy instructions
Write-Host "3️⃣ Next Steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   ✓ Redeploy Vercel:" -ForegroundColor White
Write-Host "     - Go to Vercel Dashboard → Deployments" -ForegroundColor Gray
Write-Host "     - Click '...' on latest deployment → 'Redeploy'" -ForegroundColor Gray
Write-Host ""
Write-Host "   ✓ Test the connection:" -ForegroundColor White
Write-Host "     - Visit: $VercelDomain" -ForegroundColor Gray
Write-Host "     - Try logging in" -ForegroundColor Gray
Write-Host "     - Check browser console for errors" -ForegroundColor Gray
Write-Host ""

Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📚 For detailed instructions, see: VERCEL_RAILWAY_CONNECTION.md" -ForegroundColor Cyan
```

## 🚀 Usage

```powershell
cd comestag
.\setup-vercel-railway.ps1 -RailwayUrl "https://your-app.up.railway.app" -VercelDomain "https://your-app.vercel.app"
```

## 📋 Manual Steps Still Required

The script automates Vercel setup, but you still need to:

1. **Set Railway CORS variable manually** (Railway doesn't have a CLI for this yet)
2. **Redeploy Vercel** (can be done via dashboard or CLI)

## 🔍 Verify Setup

After running the script and completing manual steps:

1. Check Vercel env vars:
   ```bash
   cd frontend
   vercel env ls
   ```

2. Test API connection:
   - Visit your Vercel site
   - Open browser DevTools → Network tab
   - Try making an API call
   - Verify requests go to Railway URL
