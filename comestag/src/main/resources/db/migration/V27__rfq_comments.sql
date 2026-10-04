CREATE TABLE rfq_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rfq_id UUID NOT NULL REFERENCES rfqs(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    body TEXT NOT NULL CHECK (length(trim(body)) > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_rfq_comments_rfq_created_at ON rfq_comments(rfq_id, created_at ASC);

CREATE TRIGGER trg_rfq_comments_touch
    BEFORE UPDATE ON rfq_comments
    FOR EACH ROW
    EXECUTE FUNCTION trg_touch_updated_at();