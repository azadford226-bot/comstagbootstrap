# Supabase Setup Script
# This script helps you configure Supabase for the backend

param(
    [string]$SupabaseUrl = "https://msnkhkvbexvrxykizidz.supabase.co",
    [string]$ServiceKey = "",
    [string]$BucketName = "comestag-media"
)

Write-Host "=== Supabase Configuration Setup ===" -ForegroundColor Cyan
Write-Host ""

if ([string]::IsNullOrEmpty($ServiceKey)) {
    Write-Host "⚠️  SUPABASE_SERVICE_KEY is required!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To get your service key:" -ForegroundColor White
    Write-Host "  1. Go to your Supabase project dashboard" -ForegroundColor Gray
    Write-Host "  2. Navigate to Settings → API" -ForegroundColor Gray
    Write-Host "  3. Copy the 'service_role' key (NOT the anon key)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Then run this script with:" -ForegroundColor Yellow
    Write-Host "  .\setup-supabase.ps1 -ServiceKey 'your-service-key-here'" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Or set it manually:" -ForegroundColor Yellow
    Write-Host "  `$env:SUPABASE_SERVICE_KEY = 'your-service-key-here'" -ForegroundColor Gray
    exit 1
}

Write-Host "Setting environment variables..." -ForegroundColor Yellow
$env:SUPABASE_URL = $SupabaseUrl
$env:SUPABASE_SERVICE_KEY = $ServiceKey
$env:SUPABASE_STORAGE_BUCKET = $BucketName

Write-Host ""
Write-Host "✅ Environment variables set:" -ForegroundColor Green
Write-Host "  SUPABASE_URL: $SupabaseUrl" -ForegroundColor Gray
Write-Host "  SUPABASE_SERVICE_KEY: ***SET***" -ForegroundColor Gray
Write-Host "  SUPABASE_STORAGE_BUCKET: $BucketName" -ForegroundColor Gray

Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Make sure you have created a storage bucket named '$BucketName' in Supabase" -ForegroundColor White
Write-Host "  2. Restart the backend to apply these settings" -ForegroundColor White
Write-Host "  3. Test file upload functionality" -ForegroundColor White
Write-Host ""
Write-Host "To restart the backend with these settings:" -ForegroundColor Yellow
Write-Host "  java -jar target\comestag-0.0.1-SNAPSHOT.jar" -ForegroundColor Gray
Write-Host ""
Write-Host "Note: These environment variables are only set for this PowerShell session." -ForegroundColor Gray
Write-Host "To make them permanent, set them in your system environment variables." -ForegroundColor Gray
