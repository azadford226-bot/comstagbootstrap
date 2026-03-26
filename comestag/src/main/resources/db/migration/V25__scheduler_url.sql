-- Optional meeting scheduler URL (Calendly, Microsoft Bookings, etc.) stored on organization profile
ALTER TABLE organizations
    ADD COLUMN scheduler_url VARCHAR(2048);

COMMENT ON COLUMN organizations.scheduler_url IS 'External scheduling link for embed/OAuth providers; shown in messages and settings';
