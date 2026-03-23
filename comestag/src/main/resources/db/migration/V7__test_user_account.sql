-- Test user account for feature testing
-- Email: tester@comstag.com / Password: Test@123!
-- Type: ADMIN (bypasses OTP, enables one-click login)
INSERT INTO accounts (
    id,
    display_name,
    type,
    email,
    password_hash,
    status,
    email_verified,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000002',
    'Test User',
    'ADMIN',
    'tester@comstag.com',
    '$2a$10$rmEN/4FN6wl8ZQ6xjPucSO4zls4UOjSVMHhRbtTWgX9V.I53WUtGW',
    'ACTIVE',
    true,
    now(),
    now()
) ON CONFLICT (email) DO NOTHING;
