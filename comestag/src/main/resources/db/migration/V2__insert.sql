-- -- ======================================================================
-- -- ACCOUNTS SEED
-- -- ======================================================================
-- INSERT INTO accounts (
--     id, display_name, type, email, password_hash,
--     status, email_verified, created_at, updated_at
-- ) VALUES
--       (
--           '2d965ef1-6a1b-4d23-b77d-7fda846d4205',
--           'Example Consumer',
--           'CONSUMER',
--           'esraaabdelnaby613@gmail.com',
--           '$2a$10$n8BTO.VZAO1Y2v0WMbNm6ei4/IAlvWfqRr.X1dvnIdCT/uJaKLbyy',
--           'ACTIVE',
--           true,
--           '2025-12-05 13:19:46.326892+00',
--           '2025-12-05 13:20:39.876386+00'
--       ),
--       (
--           'd7e41825-3e8e-430a-b3aa-04d2658b4fd9',
--           'Example Org',
--           'ORG',
--           'keromagdy589@gmail.com',
--           '$2a$10$n8BTO.VZAO1Y2v0WMbNm6ei4/IAlvWfqRr.X1dvnIdCT/uJaKLbyy',
--           'ACTIVE',
--           true,
--           '2025-12-05 13:22:40.500262+00',
--           '2025-12-05 13:22:40.500262+00'
--       );
--
--
-- INSERT INTO consumers (
--     account_id, display_name, website, industry, established,
--     interests, size, phone, country, state, city,
--     views, profile_image_id, profile_cover_id,
--     created_at, updated_at
-- ) VALUES (
--              '2d965ef1-6a1b-4d23-b77d-7fda846d4205',
--              'Example Org',
--              'https://www.example.org',
--              'Marketing',
--              '2020-05-01',
--              '|interest_3|interest_1|interest_2|',
--              '1-10',
--              NULL,
--              'Egypt',
--              'giza',
--              'faisal',
--              0,
--              NULL,
--              NULL,
--              '2025-12-05 13:19:46.326892+00',
--              '2025-12-05 13:19:46.326892+00'
--          );
--
--
-- INSERT INTO organizations (
--     account_id, display_name, website, industry, established,
--     approved, who_we_are, what_we_do, reviews_count, rating_sum,
--     size, phone, country, state, city, views,
--     profile_image_id, profile_cover_id, created_at, updated_at
-- ) VALUES (
--              'd7e41825-3e8e-430a-b3aa-04d2658b4fd9',
--              'Example Org',
--              'https://www.example.org',
--              'Marketing',
--              '2020-05-01',
--              false,
--              'We are a non-profit focused on community development.',
--              'We organize events, workshops, and training programs.',
--              0,
--              0,
--              '1-10',
--              NULL,
--              'Edypt',
--              'giza',
--              'faisal',
--              0,
--              null,
--              NULL,
--              '2025-12-05 13:22:40.500262+00',
--              '2025-12-05 14:40:31.069874+00'
--          );
--
--
-- INSERT INTO verification_code (
--     id, user_id, channel, status, code_hash,
--     expires_at, attempt_count, resend_count,
--     created_at, updated_at
-- ) VALUES (
--              '74dea4ab-1ce3-4181-9e30-35025d2c13f2',
--              '2d965ef1-6a1b-4d23-b77d-7fda846d4205',
--              'EMAIL',
--              'VERIFIED',
--              'UQbGE62z8DKjwKu4DxlZ1qsHrnXPuaYMUKEv9JxHTpE=',
--              '2025-12-05 13:31:10.161585+00',
--              0,
--              0,
--              '2025-12-05 13:19:46.932878+00',
--              '2025-12-05 13:22:29.029336+00'
--          );
--
--
-- INSERT INTO verification_code (
--     id, user_id, channel, status, code_hash,
--     expires_at, attempt_count, resend_count,
--     created_at, updated_at
-- ) VALUES (
--              '5295ea73-256e-4d97-bdbc-18e7d4fff3a7',
--              'd7e41825-3e8e-430a-b3aa-04d2658b4fd9',
--              'EMAIL',
--              'VERIFIED',
--              'eVGiicn91vgFla5ueDJwOoqYhztDTBwTgRjTJaKoPuk=',
--              '2025-12-05 13:33:25.760031+00',
--              0,
--              0,
--              '2025-12-05 13:22:40.862111+00',
--              '2025-12-05 13:23:55.830199+00'
--          );
--
-- INSERT INTO refresh_token (
--     token_id, user_id, refresh_token,
--     expiry_date, created_date, valid
-- ) VALUES (
--              '91db3739-3a72-47bb-b6db-4922f8c52279',
--              '2d965ef1-6a1b-4d23-b77d-7fda846d4205',
--              'eyJhbGciOiJIUzI1NiJ9.eyJpZGVudGlmaWVyIjoiOTFkYjM3MzktM2E3Mi00N2JiLWI2ZGItNDkyMmY4YzUyMjc5IiwidXNlcklkIjoiMmQ5NjVlZjEtNmExYi00ZDIzLWI3N2QtN2ZkYTg0NmQ0MjA1IiwiaWF0IjoxNzY0OTQwOTQ5LCJleHAiOjE3NjY3NDA5NDl9.YW2syLb2T4VYNw97A0PSeaOC8PXcD2jNjfCLgCu9JrM',
--              '2025-12-26 09:22:29.063349+00',
--              '2025-12-05 13:22:29.029336+00',
--              true
--          );
--
--
-- INSERT INTO refresh_token (
--     token_id, user_id, refresh_token,
--     expiry_date, created_date, valid
-- ) VALUES (
--              '5a51cad8-099e-4130-b7d0-8159cb953433',
--              'd7e41825-3e8e-430a-b3aa-04d2658b4fd9',
--              'eyJhbGciOiJIUzI1NiJ9.eyJpZGVudGlmaWVyIjoiNWE1MWNhZDgtMDk5ZS00MTMwLWI3ZDAtODE1OWNiOTUzNDMzIiwidXNlcklkIjoiZDdlNDE4MjUtM2U4ZS00MzBhLWIzYWEtMDRkMjY1OGI0ZmQ5IiwiaWF0IjoxNzY0OTQxMDM1LCJleHAiOjE3NjY3NDEwMzV9.m-nQf5OpLXsrtRYytZtA4xPgjGOg3cv3iV4Uuu4KfDI',
--              '2025-12-26 09:23:55.845069+00',
--              '2025-12-05 13:23:55.830199+00',
--              true
--          )


-- ==========================================
-- 1) Seed hashtags for tech industries
-- ==========================================
    INSERT INTO hashtags (name, custom)
VALUES
    ('technology',              FALSE),
    ('software-development',    FALSE),
    ('it-services',             FALSE),
    ('saas',                    FALSE),
    ('cloud-computing',         FALSE),
    ('devops',                  FALSE),
    ('ai',                      FALSE),
    ('machine-learning',        FALSE),
    ('data-science',            FALSE),
    ('cybersecurity',           FALSE),
    ('infosec',                 FALSE),
    ('fintech',                 FALSE),
    ('payments',                FALSE),
    ('ecommerce',               FALSE),
    ('marketplace',             FALSE),
    ('iot',                     FALSE),
    ('smart-devices',           FALSE),
    ('blockchain',              FALSE),
    ('web3',                    FALSE),
    ('mobile-apps',             FALSE),
    ('backend',                 FALSE),
    ('frontend',                FALSE),
    ('fullstack',               FALSE),
    ('dev-tools',               FALSE),
    ('productivity-tools',      FALSE)
ON CONFLICT (name) DO NOTHING;

-- ==========================================
-- 2) Seed tech industries
-- ==========================================
INSERT INTO industries (name, description)
VALUES
    ('Software & IT Services',          'Custom software development, IT consulting, managed services and system integration.'),
    ('SaaS & Cloud Platforms',          'Subscription-based software products delivered via the cloud.'),
    ('Artificial Intelligence & Data',  'AI, machine learning, data science, analytics and data platforms.'),
    ('Cybersecurity',                   'Security products and services, InfoSec, compliance and threat detection.'),
    ('Fintech',                         'Financial technology, payments, lending, wallets and digital banking.'),
    ('E-commerce & Marketplaces',       'Online stores, multi-vendor platforms and digital marketplaces.'),
    ('IoT & Smart Devices',             'Connected devices, sensors, hardware + software solutions.'),
    ('Developer Tools & DevOps',        'Tools for developers, DevOps, CI/CD, monitoring and productivity.'),
    ('Mobile & Web Apps',               'B2B/B2C mobile applications, web apps and digital products.')
    ON CONFLICT (name) DO NOTHING;

-- ==========================================
-- 3) Link industries <-> hashtags
--    (idempotent: ON CONFLICT DO NOTHING)
-- ==========================================

-- Software & IT Services
INSERT INTO industry_hashtags (industry_id, hashtag_id, created_at)
SELECT i.id, h.id, now()
FROM industries i
         JOIN hashtags h ON h.name IN ('technology', 'software-development', 'it-services')
WHERE i.name = 'Software & IT Services'
    ON CONFLICT DO NOTHING;

-- SaaS & Cloud Platforms
INSERT INTO industry_hashtags (industry_id, hashtag_id, created_at)
SELECT i.id, h.id, now()
FROM industries i
         JOIN hashtags h ON h.name IN ('saas', 'cloud-computing', 'devops')
WHERE i.name = 'SaaS & Cloud Platforms'
    ON CONFLICT DO NOTHING;

-- Artificial Intelligence & Data
INSERT INTO industry_hashtags (industry_id, hashtag_id, created_at)
SELECT i.id, h.id, now()
FROM industries i
         JOIN hashtags h ON h.name IN ('ai', 'machine-learning', 'data-science')
WHERE i.name = 'Artificial Intelligence & Data'
    ON CONFLICT DO NOTHING;

-- Cybersecurity
INSERT INTO industry_hashtags (industry_id, hashtag_id, created_at)
SELECT i.id, h.id, now()
FROM industries i
         JOIN hashtags h ON h.name IN ('cybersecurity', 'infosec')
WHERE i.name = 'Cybersecurity'
    ON CONFLICT DO NOTHING;

-- Fintech
INSERT INTO industry_hashtags (industry_id, hashtag_id, created_at)
SELECT i.id, h.id, now()
FROM industries i
         JOIN hashtags h ON h.name IN ('fintech', 'payments')
WHERE i.name = 'Fintech'
    ON CONFLICT DO NOTHING;

-- E-commerce & Marketplaces
INSERT INTO industry_hashtags (industry_id, hashtag_id, created_at)
SELECT i.id, h.id, now()
FROM industries i
         JOIN hashtags h ON h.name IN ('ecommerce', 'marketplace')
WHERE i.name = 'E-commerce & Marketplaces'
    ON CONFLICT DO NOTHING;

-- IoT & Smart Devices
INSERT INTO industry_hashtags (industry_id, hashtag_id, created_at)
SELECT i.id, h.id, now()
FROM industries i
         JOIN hashtags h ON h.name IN ('iot', 'smart-devices')
WHERE i.name = 'IoT & Smart Devices'
    ON CONFLICT DO NOTHING;

-- Developer Tools & DevOps
INSERT INTO industry_hashtags (industry_id, hashtag_id, created_at)
SELECT i.id, h.id, now()
FROM industries i
         JOIN hashtags h ON h.name IN ('dev-tools', 'devops', 'productivity-tools')
WHERE i.name = 'Developer Tools & DevOps'
    ON CONFLICT DO NOTHING;

-- Mobile & Web Apps
INSERT INTO industry_hashtags (industry_id, hashtag_id, created_at)
SELECT i.id, h.id, now()
FROM industries i
         JOIN hashtags h ON h.name IN ('mobile-apps', 'frontend', 'backend', 'fullstack')
WHERE i.name = 'Mobile & Web Apps'
    ON CONFLICT DO NOTHING;
