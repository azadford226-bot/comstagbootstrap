-- ======================================================================
-- ADMIN SYSTEM MIGRATION
-- ======================================================================

-- 1. Update accounts table to allow ADMIN type
ALTER TABLE accounts DROP CONSTRAINT IF EXISTS chk_account_type;
ALTER TABLE accounts ADD CONSTRAINT chk_account_type
    CHECK (type IN ('ORG','CONSUMER','ADMIN'));

-- 2. Create contact_messages table
CREATE TABLE contact_messages (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            TEXT NOT NULL,
    email           TEXT NOT NULL,
    subject         TEXT NOT NULL,
    message         TEXT NOT NULL,
    read            BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_contact_messages_read ON contact_messages(read);
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at DESC);

CREATE TRIGGER trg_contact_messages_touch
    BEFORE UPDATE ON contact_messages
    FOR EACH ROW
    EXECUTE FUNCTION trg_touch_updated_at();

-- 3. Create default admin account
-- Password: Admin@123! (BCrypt hash)
-- Email: admin@comstag.com
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
    '00000000-0000-0000-0000-000000000001',
    'System Administrator',
    'ADMIN',
    'admin@comstag.com',
    '$2a$10$n8BTO.VZAO1Y2v0WMbNm6ei4/IAlvWfqRr.X1dvnIdCT/uJaKLbyy', -- Admin@123!
    'ACTIVE',
    true,
    now(),
    now()
) ON CONFLICT (email) DO NOTHING;
