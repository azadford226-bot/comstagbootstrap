CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    account_id UUID NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB,
    created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_account ON analytics_events(account_id, event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_date ON analytics_events(created_at);
