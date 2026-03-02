-- ======================================================================
-- Messages System
-- ======================================================================

-- Conversations table
CREATE TABLE conversations (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant1_id     UUID        NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    participant2_id     UUID        NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    
    last_message_id     UUID,
    last_message_time   TIMESTAMPTZ,
    
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT fk_conversation_participant1
        FOREIGN KEY (participant1_id) REFERENCES accounts(id),
    CONSTRAINT fk_conversation_participant2
        FOREIGN KEY (participant2_id) REFERENCES accounts(id),
    CONSTRAINT chk_conversation_participants
        CHECK (participant1_id != participant2_id),
    CONSTRAINT uk_conversation_participants
        UNIQUE (participant1_id, participant2_id)
);

CREATE INDEX idx_conversations_participant1 ON conversations(participant1_id);
CREATE INDEX idx_conversations_participant2 ON conversations(participant2_id);
CREATE INDEX idx_conversations_last_message_time ON conversations(last_message_time DESC NULLS LAST);

CREATE TRIGGER trg_conversations_touch
    BEFORE UPDATE ON conversations
    FOR EACH ROW
    EXECUTE FUNCTION trg_touch_updated_at();

-- Messages table
CREATE TABLE messages (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id     UUID        NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id           UUID        NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    
    content             TEXT        NOT NULL,
    
    read                BOOLEAN     NOT NULL DEFAULT FALSE,
    read_at             TIMESTAMPTZ,
    
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT fk_message_conversation
        FOREIGN KEY (conversation_id) REFERENCES conversations(id),
    CONSTRAINT fk_message_sender
        FOREIGN KEY (sender_id) REFERENCES accounts(id)
);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_conversation_created ON messages(conversation_id, created_at DESC);
CREATE INDEX idx_messages_unread ON messages(conversation_id, read) WHERE read = FALSE;

CREATE TRIGGER trg_messages_touch
    BEFORE UPDATE ON messages
    FOR EACH ROW
    EXECUTE FUNCTION trg_touch_updated_at();

-- Function to update conversation's last message
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE conversations
    SET last_message_id = NEW.id,
        last_message_time = NEW.created_at,
        updated_at = now()
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_messages_update_conversation
    AFTER INSERT ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_last_message();
