-- ============================================================================
-- Test ORG (company) account for exercising the company dashboard features.
--
-- Requires the OTP-bypass feature (feature/notifications-prod-hardening):
--   1) Deploy that branch.
--   2) Set the Railway env var:  AUTH_OTP_BYPASS_EMAILS=testcompany@comstag.com
--   3) Run this script against the Railway PostgreSQL database.
--
-- Then log in with:
--   Email:    testcompany@comstag.com
--   Password: Test@123!
-- The login returns tokens directly (no email OTP), and the account is ORG +
-- status ACTIVE + approved, so it has the 'Profile_ACTIVE' authority required by
-- the RFQ / posts / messaging / opportunity / profile endpoints.
--
-- NOTE: The password hash below is the same one migration V7 uses for Test@123!.
-- ============================================================================

-- 1) The ORG account (pre-verified, ACTIVE -> grants Profile_ACTIVE on login)
INSERT INTO accounts (display_name, type, email, password_hash, status, email_verified, created_at, updated_at)
VALUES (
    'Test Company',
    'ORG',
    'testcompany@comstag.com',
    '$2a$10$rmEN/4FN6wl8ZQ6xjPucSO4zls4UOjSVMHhRbtTWgX9V.I53WUtGW',  -- Password: Test@123!
    'ACTIVE',
    true,
    now(),
    now()
) ON CONFLICT (email) DO NOTHING;

-- 2) The organization profile (approved), linked to the account above.
--    industry_id references an existing seeded industry (V2__insert.sql).
INSERT INTO organizations (
    account_id, display_name, website, industry_id, established, approved,
    who_we_are, what_we_do, size, country, city, created_at, updated_at
)
VALUES (
    (SELECT id FROM accounts WHERE email = 'testcompany@comstag.com'),
    'Test Company',
    'https://testcompany.example.com',
    (SELECT id FROM industries ORDER BY id LIMIT 1),
    DATE '2020-01-01',
    true,
    'We are a test organization used to exercise the company dashboard.',
    'We test RFQs, posts, messaging, opportunities and profile features.',
    '10-50',
    'United States',
    'San Francisco',
    now(),
    now()
) ON CONFLICT (account_id) DO NOTHING;

-- Verify:
-- SELECT a.email, a.type, a.status, a.email_verified, o.approved
-- FROM accounts a JOIN organizations o ON o.account_id = a.id
-- WHERE a.email = 'testcompany@comstag.com';
