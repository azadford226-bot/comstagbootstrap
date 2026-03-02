# Complete Database Setup Script for Comestag
# This script sets up the PostgreSQL database for the Comestag application

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Comestag Database Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Prompt for postgres password
$postgresPassword = Read-Host "Enter postgres user password" -AsSecureString
$postgresPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($postgresPassword))

# Set environment variable for psql
$env:PGPASSWORD = $postgresPasswordPlain

Write-Host ""
Write-Host "Step 1: Checking if database exists..." -ForegroundColor Yellow

# Check if database exists
$dbCheck = psql -U postgres -tAc "SELECT 1 FROM pg_database WHERE datname='comestag'" 2>&1
if ($LASTEXITCODE -eq 0 -and $dbCheck -eq "1") {
    Write-Host "✅ Database 'comestag' already exists" -ForegroundColor Green
} else {
    Write-Host "Creating database 'comestag'..." -ForegroundColor Yellow
    psql -U postgres -c "CREATE DATABASE comestag;" 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database created successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to create database" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "Step 2: Checking if user exists..." -ForegroundColor Yellow

# Check if user exists
$userCheck = psql -U postgres -tAc "SELECT 1 FROM pg_user WHERE usename='comestag'" 2>&1
if ($LASTEXITCODE -eq 0 -and $userCheck -eq "1") {
    Write-Host "✅ User 'comestag' already exists" -ForegroundColor Green
    Write-Host "Updating password..." -ForegroundColor Yellow
    psql -U postgres -c "ALTER USER comestag WITH PASSWORD 'comestag';" 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Password updated" -ForegroundColor Green
    }
} else {
    Write-Host "Creating user 'comestag'..." -ForegroundColor Yellow
    psql -U postgres -c "CREATE USER comestag WITH PASSWORD 'comestag';" 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ User created successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to create user" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "Step 3: Granting database privileges..." -ForegroundColor Yellow
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE comestag TO comestag;" 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database privileges granted" -ForegroundColor Green
} else {
    Write-Host "⚠️  Warning: Could not grant database privileges" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Step 4: Granting schema privileges..." -ForegroundColor Yellow
psql -U postgres -d comestag -c "GRANT ALL ON SCHEMA public TO comestag;" 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Schema privileges granted" -ForegroundColor Green
} else {
    Write-Host "⚠️  Warning: Could not grant schema privileges" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Step 5: Granting table and sequence privileges..." -ForegroundColor Yellow
psql -U postgres -d comestag -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO comestag;" 2>&1 | Out-Null
psql -U postgres -d comestag -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO comestag;" 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Default privileges granted" -ForegroundColor Green
} else {
    Write-Host "⚠️  Warning: Could not grant default privileges" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Step 6: Testing connection..." -ForegroundColor Yellow
$env:PGPASSWORD = "comestag"
$testConnection = psql -U comestag -d comestag -c "SELECT version();" 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Connection test successful!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Connection test failed, but database is set up" -ForegroundColor Yellow
}

# Clear password from environment
Remove-Item Env:\PGPASSWORD

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ Database Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Database: comestag" -ForegroundColor Cyan
Write-Host "Username: comestag" -ForegroundColor Cyan
Write-Host "Password: comestag" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Build the application: cd comestag; .\build-all.ps1" -ForegroundColor White
Write-Host "  2. Run the application: java -jar target/comestag-0.0.1-SNAPSHOT.jar" -ForegroundColor White
Write-Host ""
