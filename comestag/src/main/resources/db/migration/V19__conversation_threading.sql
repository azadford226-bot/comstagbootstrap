-- ======================================================================
-- Conversation Threading: context-based conversation linking
-- ======================================================================

ALTER TABLE conversations ADD COLUMN IF NOT EXISTS context_type VARCHAR(50);
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS context_id VARCHAR(255);

CREATE INDEX IF NOT EXISTS idx_conversations_context ON conversations(context_type, context_id);
