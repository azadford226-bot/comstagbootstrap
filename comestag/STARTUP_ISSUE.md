# Application Startup Issue - Database Connection

## Current Status

The application is **running** and listening on port 8080, but it's likely **stuck waiting for a database connection**.

### Diagnosis

- ✅ Application JAR is running (process ID: 8308)
- ✅ Port 8080 is listening
- ❌ Application is waiting for PostgreSQL database connection
- ❌ Database may not be running or configured

## The Issue

The application is configured to connect to:
- **Database**: PostgreSQL
- **Host**: localhost:5432
- **Database Name**: comestag
- **Username**: comestag
- **Password**: comestag (default)

Spring Boot is trying to:
1. Connect to PostgreSQL
2. Run Flyway database migrations
3. Validate the schema

If PostgreSQL is not running, the application will keep retrying the connection.

## Solutions

### Option 1: Start PostgreSQL (If Installed)

**Windows (Service):**
```powershell
Start-Service postgresql-x64-*
```

**Or manually:**
```powershell
cd "C:\Program Files\PostgreSQL\*\bin"
.\pg_ctl.exe start -D "C:\Program Files\PostgreSQL\*\data"
```

### Option 2: Create the Database (If PostgreSQL is Running)

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database and user
CREATE DATABASE comestag;
CREATE USER comestag WITH PASSWORD 'comestag';
GRANT ALL PRIVILEGES ON DATABASE comestag TO comestag;

-- Connect to comestag database
\c comestag
GRANT ALL ON SCHEMA public TO comestag;
```

### Option 3: Use a Remote Database

Set environment variables to use a remote database:

```powershell
$env:SPRING_DATASOURCE_URL="jdbc:postgresql://your-db-host:5432/comestag"
$env:SPRING_DATASOURCE_USERNAME="your_username"
$env:SPRING_DATASOURCE_PASSWORD="your_password"
$env:SPRING_PROFILES_ACTIVE="stag"

# Then restart the application
java -jar target/comestag-0.0.1-SNAPSHOT.jar
```

### Option 4: Install PostgreSQL (If Not Installed)

1. Download from: https://www.postgresql.org/download/windows/
2. Install PostgreSQL
3. During installation, set password for postgres user
4. Create the comestag database (see Option 2)

### Option 5: Use Docker PostgreSQL (Quick Start)

```powershell
# Start PostgreSQL in Docker
docker run --name postgres-comestag `
  -e POSTGRES_DB=comestag `
  -e POSTGRES_USER=comestag `
  -e POSTGRES_PASSWORD=comestag `
  -p 5432:5432 `
  -d postgres:15

# Wait for it to start (5-10 seconds)
Start-Sleep -Seconds 10

# Then restart your application
```

### Option 6: Skip Database for Testing (Not Recommended)

If you just want to see the frontend, you could temporarily disable database:
- Not recommended as the app requires database
- Would need code changes

## Recommended Action

**For quick testing with Docker:**

```powershell
# 1. Start PostgreSQL in Docker
docker run --name postgres-comestag `
  -e POSTGRES_DB=comestag `
  -e POSTGRES_USER=comestag `
  -e POSTGRES_PASSWORD=comestag `
  -p 5432:5432 `
  -d postgres:15

# 2. Wait a few seconds
Start-Sleep -Seconds 10

# 3. Stop current application (Ctrl+C or kill process)
Stop-Process -Id 8308 -Force

# 4. Restart application
cd D:\comstag\fomregyptcomestag\comestag
$env:JAVA_HOME = "C:\Program Files (x86)\Java\jdk-21"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
java -jar target/comestag-0.0.1-SNAPSHOT.jar
```

## Check Current Status

To see what's happening, you can:
1. Check if PostgreSQL is running: `Get-Service postgresql*`
2. Check if port 5432 is listening: `netstat -ano | findstr :5432`
3. Try connecting: `psql -U comestag -d comestag -h localhost`

Once the database is available, the application should complete startup within 30-60 seconds.


