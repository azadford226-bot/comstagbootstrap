-- Manual Email Verification Script
-- Run this in PostgreSQL to verify an email for testing
-- Replace 'YOUR_EMAIL@example.com' with the actual email you registered with

-- Option 1: Verify by email
UPDATE accounts 
SET email_verified = TRUE 
WHERE email = 'YOUR_EMAIL@example.com';

-- Option 2: Verify all unverified accounts (for testing only!)
-- UPDATE accounts SET email_verified = TRUE WHERE email_verified = FALSE;

-- Check the result
SELECT id, email, email_verified, display_name, type, status 
FROM accounts 
WHERE email = 'YOUR_EMAIL@example.com';
