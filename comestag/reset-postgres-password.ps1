# Reset PostgreSQL postgres Password Script
# Run this script as Administrator

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "PostgreSQL Password Reset Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "⚠️  WARNING: This script should be run as Administrator!" -ForegroundColor Yellow
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        exit
    }
}

# Find PostgreSQL service
$pgService = Get-Service | Where-Object {$_.Name -like "*postgresql*"} | Select-Object -First 1
if (-not $pgService) {
    Write-Host "❌ PostgreSQL service not found!" -ForegroundColor Red
    exit 1
}

Write-Host "Found PostgreSQL service: $($pgService.Name)" -ForegroundColor Green
Write-Host "Current status: $($pgService.Status)" -ForegroundColor Yellow
Write-Host ""

# Find pg_hba.conf
$pgHbaPath = "C:\Program Files\PostgreSQL\18\data\pg_hba.conf"
if (-not (Test-Path $pgHbaPath)) {
    Write-Host "❌ pg_hba.conf not found at: $pgHbaPath" -ForegroundColor Red
    Write-Host "Please locate it manually and update the script." -ForegroundColor Yellow
    exit 1
}

Write-Host "Found pg_hba.conf: $pgHbaPath" -ForegroundColor Green
Write-Host ""

# Backup pg_hba.conf
$backupPath = "$pgHbaPath.backup.$(Get-Date -Format 'yyyyMMddHHmmss')"
Write-Host "Creating backup: $backupPath" -ForegroundColor Yellow
Copy-Item $pgHbaPath $backupPath
Write-Host "✅ Backup created" -ForegroundColor Green
Write-Host ""

# Step 1: Stop PostgreSQL
Write-Host "Step 1: Stopping PostgreSQL service..." -ForegroundColor Cyan
if ($pgService.Status -eq "Running") {
    Stop-Service -Name $pgService.Name -Force
    Start-Sleep -Seconds 2
    Write-Host "✅ Service stopped" -ForegroundColor Green
} else {
    Write-Host "⚠️  Service already stopped" -ForegroundColor Yellow
}
Write-Host ""

# Step 2: Modify pg_hba.conf
Write-Host "Step 2: Modifying pg_hba.conf to allow trust connections..." -ForegroundColor Cyan
$content = Get-Content $pgHbaPath -Raw
$originalContent = $content

# Replace scram-sha-256 and md5 with trust for localhost
$content = $content -replace '(host\s+all\s+all\s+127\.0\.0\.1/32\s+)(scram-sha-256|md5)', '$1trust'
$content = $content -replace '(host\s+all\s+all\s+::1/128\s+)(scram-sha-256|md5)', '$1trust'

if ($content -eq $originalContent) {
    Write-Host "⚠️  No changes made. pg_hba.conf might already be set to trust, or format is different." -ForegroundColor Yellow
    Write-Host "You may need to edit it manually." -ForegroundColor Yellow
} else {
    Set-Content -Path $pgHbaPath -Value $content -NoNewline
    Write-Host "✅ pg_hba.conf modified" -ForegroundColor Green
}
Write-Host ""

# Step 3: Start PostgreSQL
Write-Host "Step 3: Starting PostgreSQL service..." -ForegroundColor Cyan
Start-Service -Name $pgService.Name
Start-Sleep -Seconds 3
Write-Host "✅ Service started" -ForegroundColor Green
Write-Host ""

# Step 4: Prompt for new password
Write-Host "Step 4: Setting new password..." -ForegroundColor Cyan
Write-Host ""
$newPassword = Read-Host "Enter new password for 'postgres' user" -AsSecureString
$passwordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($newPassword))

Write-Host ""
Write-Host "Connecting to PostgreSQL..." -ForegroundColor Yellow

# Set password using psql
$sqlCommand = "ALTER USER postgres WITH PASSWORD '$passwordPlain';"
$result = echo $sqlCommand | psql -U postgres -d postgres 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Password changed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to change password. Error:" -ForegroundColor Red
    Write-Host $result -ForegroundColor Red
    Write-Host ""
    Write-Host "You may need to run this SQL command manually:" -ForegroundColor Yellow
    Write-Host "  psql -U postgres" -ForegroundColor White
    Write-Host "  ALTER USER postgres WITH PASSWORD '$passwordPlain';" -ForegroundColor White
}

Write-Host ""

# Step 5: Revert pg_hba.conf
Write-Host "Step 5: Reverting pg_hba.conf for security..." -ForegroundColor Cyan
$revertContent = Get-Content $backupPath -Raw
Set-Content -Path $pgHbaPath -Value $revertContent -NoNewline
Write-Host "✅ pg_hba.conf reverted" -ForegroundColor Green
Write-Host ""

# Restart service
Write-Host "Restarting PostgreSQL service..." -ForegroundColor Yellow
Restart-Service -Name $pgService.Name
Start-Sleep -Seconds 2
Write-Host "✅ Service restarted" -ForegroundColor Green
Write-Host ""

# Step 6: Test connection
Write-Host "Step 6: Testing new password..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Please test the connection manually:" -ForegroundColor Yellow
Write-Host "  psql -U postgres" -ForegroundColor White
Write-Host "  Enter password: $passwordPlain" -ForegroundColor White
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Password Reset Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your new postgres password is: $passwordPlain" -ForegroundColor Yellow
Write-Host "⚠️  Save this password securely!" -ForegroundColor Yellow
Write-Host ""
Write-Host "Backup file saved at: $backupPath" -ForegroundColor Cyan
Write-Host ""
