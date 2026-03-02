# Database Setup Script for Comestag
# This script sets up the PostgreSQL database for the Comestag application

Write-Host "Setting up Comestag database..." -ForegroundColor Cyan

# Check if database already exists
Write-Host "`nChecking if database exists..." -ForegroundColor Yellow
$dbExists = psql -U postgres -tAc "SELECT 1 FROM pg_database WHERE datname='comestag'" 2>&1

if ($LASTEXITCODE -eq 0 -and $dbExists -eq "1") {
    Write-Host "Database 'comestag' already exists." -ForegroundColor Green
    Write-Host "Checking if user exists..." -ForegroundColor Yellow
    
    $userExists = psql -U postgres -tAc "SELECT 1 FROM pg_user WHERE usename='comestag'" 2>&1
    if ($LASTEXITCODE -eq 0 -and $userExists -eq "1") {
        Write-Host "User 'comestag' already exists." -ForegroundColor Green
        Write-Host "`nDatabase setup is complete!" -ForegroundColor Green
        exit 0
    }
}

Write-Host "`nCreating database and user..." -ForegroundColor Yellow

# Create database (if it doesn't exist)
$createDb = @"
CREATE DATABASE comestag;
"@

# Create user and grant privileges
$createUser = @"
CREATE USER comestag WITH PASSWORD 'comestag';
GRANT ALL PRIVILEGES ON DATABASE comestag TO comestag;
"@

# Grant schema privileges (run on comestag database)
$grantSchema = @"
GRANT ALL ON SCHEMA public TO comestag;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO comestag;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO comestag;
"@

try {
    # Create database
    Write-Host "Creating database..." -ForegroundColor Yellow
    $createDb | psql -U postgres 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Note: Database might already exist (this is okay)" -ForegroundColor Yellow
    }
    
    # Create user
    Write-Host "Creating user..." -ForegroundColor Yellow
    $createUser | psql -U postgres 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Note: User might already exist (this is okay)" -ForegroundColor Yellow
    }
    
    # Grant schema privileges
    Write-Host "Granting schema privileges..." -ForegroundColor Yellow
    $grantSchema | psql -U postgres -d comestag 2>&1 | Out-Null
    
    Write-Host "`n✅ Database setup complete!" -ForegroundColor Green
    Write-Host "`nDatabase: comestag" -ForegroundColor Cyan
    Write-Host "Username: comestag" -ForegroundColor Cyan
    Write-Host "Password: comestag" -ForegroundColor Cyan
    Write-Host "`nYou can now run the application:" -ForegroundColor Yellow
    Write-Host "  cd comestag" -ForegroundColor White
    Write-Host "  .\build-all.ps1" -ForegroundColor White
    Write-Host "  java -jar target/comestag-0.0.1-SNAPSHOT.jar" -ForegroundColor White
    
} catch {
    Write-Host "`n❌ Error setting up database: $_" -ForegroundColor Red
    Write-Host "`nPlease run the following commands manually:" -ForegroundColor Yellow
    Write-Host "  psql -U postgres" -ForegroundColor White
    Write-Host "  Then run the SQL commands from create-database.sql" -ForegroundColor White
    exit 1
}
