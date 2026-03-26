CREATE TABLE IF NOT EXISTS rfq_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    account_id UUID NOT NULL,
    keyword VARCHAR(255),
    category VARCHAR(255),
    created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rfq_subscriptions_account ON rfq_subscriptions(account_id);
