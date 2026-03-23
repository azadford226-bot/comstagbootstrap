CREATE TABLE IF NOT EXISTS notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL UNIQUE REFERENCES accounts(id) ON DELETE CASCADE,
    email_digest VARCHAR(20) NOT NULL DEFAULT 'daily',
    in_app_enabled BOOLEAN NOT NULL DEFAULT true,
    push_enabled BOOLEAN NOT NULL DEFAULT false,
    rfq_alerts BOOLEAN NOT NULL DEFAULT true,
    message_alerts BOOLEAN NOT NULL DEFAULT true,
    opportunity_alerts BOOLEAN NOT NULL DEFAULT true,
    system_alerts BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);
