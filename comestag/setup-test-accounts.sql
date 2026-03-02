-- ==================================================
-- TEST ACCOUNTS SETUP SCRIPT
-- ==================================================
-- This script creates test accounts for development and testing
-- 
-- Test Accounts:
-- 1. Test Company: testcompany@comstag.com / Test123!
-- 2. Admin User: admin@comstag.com / Admin123!
--
-- IMPORTANT: Only run this in development/testing environments!
-- ==================================================

-- Clean up existing test accounts if they exist
DELETE FROM organization_profiles WHERE email IN ('testcompany@comstag.com');
DELETE FROM consumer_profiles WHERE email IN ('testconsumer@comstag.com');
DELETE FROM admin WHERE email IN ('admin@comstag.com');
DELETE FROM users WHERE email IN ('testcompany@comstag.com', 'testconsumer@comstag.com', 'admin@comstag.com');

-- ==================================================
-- 1. CREATE TEST COMPANY ACCOUNT
-- ==================================================

-- Insert test company user
-- Password: Test123! (BCrypt hash)
-- Note: You'll need to generate the actual BCrypt hash using your application
-- The hash below is a placeholder - replace with actual BCrypt hash from your system
INSERT INTO users (id, email, password_hash, verified, user_type, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'testcompany@comstag.com',
    '$2a$10$placeholder.replace.with.actual.bcrypt.hash',  -- Password: Test123!
    true,  -- Pre-verified for testing
    'ORGANIZATION',
    NOW(),
    NOW()
);

-- Insert test company organization profile
INSERT INTO organization_profiles (
    id, email, display_name, industry_id, size, country, state, city,
    established, website, who_we_are, what_we_do, profile_image, cover_image,
    approved, created_at, updated_at
)
VALUES (
    (SELECT id FROM users WHERE email = 'testcompany@comstag.com'),
    'testcompany@comstag.com',
    'Test Company Ltd',
    1,  -- Assuming industry_id 1 exists (Technology/General)
    '50-200',
    'United States',
    'California',
    'San Francisco',
    '2020-01-01',
    'https://testcompany.example.com',
    'We are a test company for development and testing purposes. This account is used to test all dashboard features and functionality.',
    'We provide comprehensive testing services and ensure the platform works correctly. Our test data helps developers validate features.',
    '',
    '',
    true,  -- Pre-approved for testing
    NOW(),
    NOW()
);

-- ==================================================
-- 2. CREATE TEST CONSUMER ACCOUNT (Optional)
-- ==================================================

-- Insert test consumer user
INSERT INTO users (id, email, password_hash, verified, user_type, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'testconsumer@comstag.com',
    '$2a$10$placeholder.replace.with.actual.bcrypt.hash',  -- Password: Test123!
    true,  -- Pre-verified for testing
    'CONSUMER',
    NOW(),
    NOW()
);

-- Insert test consumer profile
INSERT INTO consumer_profiles (
    id, email, display_name, industry_id, interests, country, state, city,
    size, established, website, profile_image, cover_image, created_at, updated_at
)
VALUES (
    (SELECT id FROM users WHERE email = 'testconsumer@comstag.com'),
    'testconsumer@comstag.com',
    'Test Consumer',
    2,  -- Assuming industry_id 2 exists
    ARRAY[1, 2, 3],  -- Sample interest IDs
    'Canada',
    'Ontario',
    'Toronto',
    'Individual',
    '2023-01-01',
    'https://testconsumer.example.com',
    '',
    '',
    NOW(),
    NOW()
);

-- ==================================================
-- 3. CREATE ADMIN ACCOUNT
-- ==================================================

-- Insert admin user
INSERT INTO users (id, email, password_hash, verified, user_type, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'admin@comstag.com',
    '$2a$10$placeholder.replace.with.actual.bcrypt.hash',  -- Password: Admin123!
    true,  -- Pre-verified for testing
    'ADMIN',
    NOW(),
    NOW()
);

-- Insert admin record
INSERT INTO admin (
    id, email, display_name, role, active, created_at, updated_at
)
VALUES (
    (SELECT id FROM users WHERE email = 'admin@comstag.com'),
    'admin@comstag.com',
    'Admin User',
    'SUPER_ADMIN',
    true,
    NOW(),
    NOW()
);

-- ==================================================
-- VERIFICATION
-- ==================================================

-- Verify accounts were created
SELECT 'Test Accounts Created:' as status;
SELECT email, user_type, verified FROM users WHERE email IN ('testcompany@comstag.com', 'testconsumer@comstag.com', 'admin@comstag.com');

-- Instructions for generating password hashes
SELECT '
==================================================
IMPORTANT: PASSWORD HASH GENERATION
==================================================

The SQL script above contains placeholder password hashes.
You need to replace them with actual BCrypt hashes.

To generate the hashes:

Option 1: Use Java (recommended)
--------------------------------
Run: java GeneratePasswordHash.java Test123!
Run: java GeneratePasswordHash.java Admin123!

Option 2: Use Online BCrypt Generator
--------------------------------------
Visit: https://bcrypt-generator.com/
Enter password: Test123!
Rounds: 10
Copy the hash

Option 3: Use PowerShell script
--------------------------------
See: generate-password-hashes.ps1

After generating the hashes, update this SQL file:
1. Replace $2a$10$placeholder.replace.with.actual.bcrypt.hash
2. Run this script again

Credentials:
- Test Company: testcompany@comstag.com / Test123!
- Test Consumer: testconsumer@comstag.com / Test123!
- Admin: admin@comstag.com / Admin123!

==================================================' as instructions;
