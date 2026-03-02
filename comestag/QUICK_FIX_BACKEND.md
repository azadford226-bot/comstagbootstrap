# Quick Fix: Backend Not Starting

## Current Issue
Backend process is running but not responding to HTTP requests. This usually means it's stuck during startup.

## Most Common Cause: Database Connection

The backend is likely waiting for a database connection that never completes.

## Quick Fix Steps

### Step 1: Check PostgreSQL is Running

```powershell
Get-Service -Name "*postgresql*"
```

If not running, start it:
```powershell
Start-Service postgresql-x64-*
```

### Step 2: Create Database and User

Connect to PostgreSQL:
```powershell
psql -U postgres
```

Then run:
```sql
-- Create database
CREATE DATABASE comestag;

-- Create user
CREATE USER comestag WITH PASSWORD 'comestag';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE comestag TO comestag;

-- Connect to database
\c comestag

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO comestag;
```

### Step 3: Verify Connection

Test the connection:
```powershell
$env:PGPASSWORD = "comestag"
psql -U comestag -d comestag -c "SELECT version();"
```

### Step 4: Restart Backend

After database is set up:
```powershell
cd d:\comstag\fomregyptcomestag\comestag
.\start-backend.ps1
```

Or manually:
```powershell
$env:SPRING_PROFILES_ACTIVE = "local"
$env:SPRING_DATASOURCE_URL = "jdbc:postgresql://localhost:5432/comestag"
$env:SPRING_DATASOURCE_USERNAME = "comestag"
$env:SPRING_DATASOURCE_PASSWORD = "comestag"
$env:APP_SECURITY_JWT_SECRET = "local-dev-jwt-secret-change-in-production-min-32-chars"
$env:VERIFICATION_CODE_SECRET = "local-dev-verification-secret-change-in-production"
$env:AUTH_TOKEN_USER_SECRET_KEY = "local-dev-auth-token-secret-change-in-production"

java -jar target\comestag-0.0.1-SNAPSHOT.jar
```

## What to Look For

In the backend console window, look for:

1. **Success**: `"Started ComestagApplication"` - Backend is ready!
2. **Database Error**: `"Connection refused"` or `"Authentication failed"` - Database issue
3. **Migration Error**: Flyway migration errors - Database permissions issue
4. **Port Error**: `"Port already in use"` - Another process using port 3000

## Alternative: Use Different Database

If you want to use a different database:

```powershell
$env:SPRING_DATASOURCE_URL = "jdbc:postgresql://your-host:5432/your-database"
$env:SPRING_DATASOURCE_USERNAME = "your-username"
$env:SPRING_DATASOURCE_PASSWORD = "your-password"
```

## Still Not Working?

1. Check the backend console window for the exact error message
2. Verify PostgreSQL is actually running: `Get-Process -Name "postgres"`
3. Check if port 3000 is free: `netstat -ano | findstr ":3000"`
4. Try starting with debug logging:
   ```powershell
   $env:SPRING_PROFILES_ACTIVE = "local"
   java -jar target\comestag-0.0.1-SNAPSHOT.jar --debug
   ```
