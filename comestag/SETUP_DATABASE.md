# Database Setup Guide

## Quick Setup

The application requires a PostgreSQL database named `comestag`. Here's how to create it:

### Option 1: Using psql Command Line

```bash
# Connect as postgres user
psql -U postgres

# Then run these commands:
CREATE DATABASE comestag;
CREATE USER comestag WITH PASSWORD 'comestag';
GRANT ALL PRIVILEGES ON DATABASE comestag TO comestag;

# Connect to the new database
\c comestag

# Grant schema privileges
GRANT ALL ON SCHEMA public TO comestag;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO comestag;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO comestag;
```

### Option 2: Using SQL File

```bash
psql -U postgres -f create-database.sql
```

### Option 3: Using pgAdmin

1. Open pgAdmin
2. Connect to PostgreSQL server
3. Right-click "Databases" → Create → Database
4. Name: `comestag`
5. Right-click "Login/Group Roles" → Create → Login/Group Role
6. Name: `comestag`, Password: `comestag`
7. Under Privileges, grant all privileges to the database

### Option 4: Using Docker (If PostgreSQL is in Docker)

```bash
docker exec -it <postgres-container-name> psql -U postgres

# Then run the CREATE commands above
```

## Verify Setup

After creating the database, verify:

```bash
psql -U comestag -d comestag -h localhost
```

If it connects successfully, you're good to go!

## After Database Creation

Once the database is created, **the application should automatically**:
1. Detect the database connection
2. Run Flyway migrations (create all tables)
3. Complete startup
4. Be accessible at http://localhost:8080

## Current Status

Your application is waiting for the database to exist. Once created, it should start up within 30-60 seconds.


