-- Quick Database Setup for Comestag
-- Run this as: psql -U postgres -f setup-database-quick.sql
-- Or copy-paste into psql interactive session

-- Create database (if it doesn't exist)
CREATE DATABASE comestag;

-- Create user (if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'comestag') THEN
        CREATE USER comestag WITH PASSWORD 'comestag';
    ELSE
        ALTER USER comestag WITH PASSWORD 'comestag';
    END IF;
END
$$;

-- Grant database privileges
GRANT ALL PRIVILEGES ON DATABASE comestag TO comestag;

-- Connect to comestag database and grant schema privileges
\c comestag

GRANT ALL ON SCHEMA public TO comestag;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO comestag;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO comestag;

-- Verify setup
SELECT 'Database setup complete!' AS status;
