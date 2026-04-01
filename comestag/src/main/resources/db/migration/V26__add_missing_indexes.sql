-- Add missing indexes for frequently queried foreign key columns
-- These indexes improve query performance for common lookups

-- posts by org_id (feed queries, profile page)
CREATE INDEX IF NOT EXISTS idx_posts_org_id ON posts (org_id);

-- capabilities by org_id
CREATE INDEX IF NOT EXISTS idx_capabilities_org_id ON capabilities (org_id);

-- certificates by org_id
CREATE INDEX IF NOT EXISTS idx_certificates_org_id ON certificates (org_id);

-- success_stories by org_id
CREATE INDEX IF NOT EXISTS idx_success_stories_org_id ON success_stories (org_id);

-- post_comments by post_id
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments (post_id);

-- accounts by type (admin lookups)
CREATE INDEX IF NOT EXISTS idx_accounts_type ON accounts (type);
