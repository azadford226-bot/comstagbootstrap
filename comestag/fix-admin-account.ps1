# Script to verify and fix admin account in database
# This ensures the admin account exists with correct credentials

param(
    [string]$DbHost = "localhost",
    [int]$DbPort = 5432,
    [string]$DbName = "comestag",
    [string]$DbUser = "comestag",
    [string]$DbPassword = "comestag"
)

Write-Host "=== Admin Account Fix Utility ===" -ForegroundColor Cyan
Write-Host ""

# Connection string
$connectionString = "Host=$DbHost;Port=$DbPort;Database=$DbName;Username=$DbUser;Password=$DbPassword"

Write-Host "Connecting to database..." -ForegroundColor Yellow
Write-Host "  Host: $DbHost" -ForegroundColor Gray
Write-Host "  Database: $DbName" -ForegroundColor Gray
Write-Host "  User: $DbUser" -ForegroundColor Gray
Write-Host ""

try {
    # Check if Npgsql is available
    $npgsqlAvailable = $false
    try {
        Add-Type -Path "C:\Program Files\dotnet\shared\Microsoft.NETCore.App\*\System.Data.Common.dll" -ErrorAction SilentlyContinue
        $npgsqlAvailable = $true
    } catch {
        # Try alternative method using psql
    }

    if (-not $npgsqlAvailable) {
        Write-Host "Using psql command line tool..." -ForegroundColor Yellow
        
        # Create SQL script
        $sqlScript = @"
-- Check if admin account exists
SELECT 
    id,
    email,
    display_name,
    type,
    status,
    email_verified,
    created_at
FROM accounts 
WHERE email = 'admin@comstag.com';

-- Fix admin account (create or update)
INSERT INTO accounts (
    id,
    display_name,
    type,
    email,
    password_hash,
    status,
    email_verified,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'System Administrator',
    'ADMIN',
    'admin@comstag.com',
    '$2a$10$n8BTO.VZAO1Y2v0WMbNm6ei4/IAlvWfqRr.X1dvnIdCT/uJaKLbyy', -- Admin@123!
    'ACTIVE',
    true,
    now(),
    now()
) ON CONFLICT (email) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    status = 'ACTIVE',
    email_verified = true,
    type = 'ADMIN',
    updated_at = now();

-- Verify the account
SELECT 
    email,
    type,
    status,
    email_verified,
    CASE 
        WHEN password_hash = '$2a$10$n8BTO.VZAO1Y2v0WMbNm6ei4/IAlvWfqRr.X1dvnIdCT/uJaKLbyy' 
        THEN 'Password hash is correct'
        ELSE 'Password hash mismatch!'
    END as password_status
FROM accounts 
WHERE email = 'admin@comstag.com';
"@

        $tempFile = [System.IO.Path]::GetTempFileName() + ".sql"
        $sqlScript | Out-File -FilePath $tempFile -Encoding UTF8

        Write-Host "Executing SQL script..." -ForegroundColor Yellow
        
        $env:PGPASSWORD = $DbPassword
        $result = & psql -h $DbHost -p $DbPort -U $DbUser -d $DbName -f $tempFile 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[SUCCESS] Admin account verified/fixed!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Admin Credentials:" -ForegroundColor Cyan
            Write-Host "  Email: admin@comstag.com" -ForegroundColor White
            Write-Host "  Password: Admin@123!" -ForegroundColor White
            Write-Host ""
            Write-Host "You can now login at: http://localhost:3000/admin/login" -ForegroundColor Green
        } else {
            Write-Host "[ERROR] Failed to execute SQL script" -ForegroundColor Red
            Write-Host $result -ForegroundColor Red
            Write-Host ""
            Write-Host "Alternative: Run this SQL manually in your database:" -ForegroundColor Yellow
            Write-Host $sqlScript -ForegroundColor Gray
        }
        
        Remove-Item $tempFile -ErrorAction SilentlyContinue
        $env:PGPASSWORD = $null
        
    } else {
        Write-Host "[ERROR] Direct database connection not available" -ForegroundColor Red
        Write-Host "Please use psql or run the SQL manually" -ForegroundColor Yellow
    }

} catch {
    Write-Host "[ERROR] $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Manual SQL Fix:" -ForegroundColor Yellow
    Write-Host "Run this SQL in your PostgreSQL database:" -ForegroundColor White
    Write-Host @"

-- Fix admin account
INSERT INTO accounts (
    id,
    display_name,
    type,
    email,
    password_hash,
    status,
    email_verified,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'System Administrator',
    'ADMIN',
    'admin@comstag.com',
    '$2a$10$n8BTO.VZAO1Y2v0WMbNm6ei4/IAlvWfqRr.X1dvnIdCT/uJaKLbyy',
    'ACTIVE',
    true,
    now(),
    now()
) ON CONFLICT (email) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    status = 'ACTIVE',
    email_verified = true,
    type = 'ADMIN',
    updated_at = now();
"@ -ForegroundColor Gray
}

Write-Host ""
Write-Host "=== Done ===" -ForegroundColor Cyan
