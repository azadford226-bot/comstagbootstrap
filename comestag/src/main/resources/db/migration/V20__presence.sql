-- ======================================================================
-- User Presence: heartbeat-based online status tracking
-- ======================================================================

CREATE TABLE IF NOT EXISTS user_presence (
    account_id UUID PRIMARY KEY REFERENCES accounts(id) ON DELETE CASCADE,
    last_seen  TIMESTAMP NOT NULL DEFAULT now(),
    is_online  BOOLEAN   DEFAULT false
);
