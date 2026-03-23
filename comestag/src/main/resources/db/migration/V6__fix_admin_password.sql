-- Fix admin password hash (V5 had an invalid bcrypt hash)
-- Password: Admin@123!
UPDATE accounts
SET password_hash = '$2a$10$N/uhgFD0aDnyalBvy4J4o.HaGUltOjHiDEKhLQSvPfGboR8siAvqq',
    status = 'ACTIVE',
    email_verified = true,
    updated_at = now()
WHERE email = 'admin@comstag.com';
