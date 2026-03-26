ALTER TABLE organizations ADD COLUMN IF NOT EXISTS profile_visibility VARCHAR(20) DEFAULT 'public';
