ALTER TABLE notification_recipients ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT false;
ALTER TABLE notification_recipients ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;
