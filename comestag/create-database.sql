-- Create database and user for Comestag application
-- Run this as postgres superuser: psql -U postgres -f create-database.sql

-- Create database
CREATE DATABASE comestag;

-- Create user
CREATE USER comestag WITH PASSWORD 'comestag';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE comestag TO comestag;

-- Connect to the new database and grant schema privileges
\c comestag
GRANT ALL ON SCHEMA public TO comestag;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO comestag;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO comestag;


