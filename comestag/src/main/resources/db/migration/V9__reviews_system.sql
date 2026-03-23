-- Reviews and ratings system for partner feedback
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reviewer_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    reviewed_org_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    body TEXT,
    engagement_type VARCHAR(30),
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now(),
    UNIQUE(reviewer_id, reviewed_org_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_reviewed ON reviews(reviewed_org_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer ON reviews(reviewer_id);
