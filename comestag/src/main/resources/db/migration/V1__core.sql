-- ======================================================================
-- Extensions
-- ======================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS plpgsql;

-- ======================================================================
-- Generic updated_at trigger
-- ======================================================================
CREATE OR REPLACE FUNCTION trg_touch_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
RETURN NEW;
END;
$$;

-- ======================================================================
-- ACCOUNTS
-- ======================================================================
CREATE TABLE accounts (
                          id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                          display_name   TEXT        NOT NULL,
                          type           VARCHAR(50) NOT NULL DEFAULT 'CONSUMER',
                          email          TEXT        NOT NULL UNIQUE,
                          password_hash  TEXT        NOT NULL,
                          status         VARCHAR(50) NOT NULL DEFAULT 'PENDING',
                          email_verified BOOLEAN     NOT NULL DEFAULT FALSE,
                          created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
                          updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
                          CONSTRAINT chk_account_type
                              CHECK (type IN ('ORG','CONSUMER'))
);

CREATE TRIGGER trg_accounts_touch
    BEFORE UPDATE ON accounts
    FOR EACH ROW
    EXECUTE FUNCTION trg_touch_updated_at();

-- ======================================================================
-- MEDIA
-- ======================================================================
CREATE TABLE media (
                       id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                       owner_account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,

                       uri        TEXT NOT NULL,
                       media_type TEXT NOT NULL
                           CHECK (media_type IN ('IMAGE','VIDEO','FILE')),
                       status     TEXT NOT NULL DEFAULT 'UNLINKED'
                           CHECK (status IN ('UNLINKED','LINKED','DELETED')),

                       alt_text   TEXT,
                       created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                       updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_media_touch
    BEFORE UPDATE ON media
    FOR EACH ROW
    EXECUTE FUNCTION trg_touch_updated_at();

-- ======================================================================
-- HASHTAGS
-- ======================================================================
CREATE TABLE hashtags (
                          id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                          name        TEXT NOT NULL UNIQUE,
                          custom      BOOLEAN NOT NULL DEFAULT TRUE,
                          updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER SEQUENCE hashtags_id_seq RESTART WITH 1;

-- ======================================================================
-- Industries
-- ======================================================================
-- 1) Industries table
CREATE TABLE industries (
                            id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                            name        TEXT        NOT NULL UNIQUE,
                            description TEXT,
                            created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
                            updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2) Join table between industries and hashtags
CREATE TABLE industry_hashtags (
                                   industry_id BIGINT NOT NULL,
                                   hashtag_id  BIGINT NOT NULL,

                                   created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

                                   CONSTRAINT pk_industry_hashtags
                                       PRIMARY KEY (industry_id, hashtag_id),

                                   CONSTRAINT fk_industry_hashtags_industry
                                       FOREIGN KEY (industry_id)
                                           REFERENCES industries(id)
                                           ON DELETE CASCADE,

                                   CONSTRAINT fk_industry_hashtags_hashtag
                                       FOREIGN KEY (hashtag_id)
                                           REFERENCES hashtags(id)
                                           ON DELETE CASCADE
);

-- ======================================================================
-- ORGANIZATIONS
-- ======================================================================
CREATE TABLE organizations (
                               account_id       UUID PRIMARY KEY REFERENCES accounts(id) ON DELETE CASCADE,
                               display_name     TEXT        NOT NULL,
                               website          TEXT        NOT NULL,
                               industry_id      BIGINT      NOT NULL REFERENCES industries(id),
                               established      DATE        NOT NULL,
                               approved         BOOLEAN     NOT NULL DEFAULT FALSE,

                               who_we_are       TEXT,
                               what_we_do       TEXT,
                               reviews_count    BIGINT      NOT NULL DEFAULT 0,
                               rating_sum       BIGINT      NOT NULL DEFAULT 0,
                               size             TEXT,
                               phone            TEXT,
                               country          TEXT,
                               state            TEXT,
                               city             TEXT,
                               views            INT         DEFAULT 0,

                               profile_image_id UUID,
                               profile_cover_id UUID,

                               created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
                               updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),

                               CONSTRAINT fk_org_profile_image_media
                                   FOREIGN KEY (profile_image_id) REFERENCES media(id) ON DELETE SET NULL,
                               CONSTRAINT fk_org_profile_cover_media
                                   FOREIGN KEY (profile_cover_id) REFERENCES media(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_org_industry_id
    ON organizations(industry_id);

CREATE OR REPLACE FUNCTION trg_org_profile_media_mark_linked()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  ------------------------------------------------------------------
  -- 1) On UPDATE: unlink old media if the reference changed
  ------------------------------------------------------------------
  IF TG_OP = 'UPDATE' THEN
    -- profile_image_id changed or removed
    IF OLD.profile_image_id IS NOT NULL
       AND OLD.profile_image_id IS DISTINCT FROM NEW.profile_image_id THEN
UPDATE media
SET status = 'UNLINKED'
WHERE id = OLD.profile_image_id
  AND status <> 'DELETED';  -- keep DELETED as-is
END IF;

    -- profile_cover_id changed or removed
    IF OLD.profile_cover_id IS NOT NULL
       AND OLD.profile_cover_id IS DISTINCT FROM NEW.profile_cover_id THEN
UPDATE media
SET status = 'UNLINKED'
WHERE id = OLD.profile_cover_id
  AND status <> 'DELETED';
END IF;
END IF;

  ------------------------------------------------------------------
  -- 2) On INSERT or UPDATE: mark new media as LINKED
  ------------------------------------------------------------------
  IF NEW.profile_image_id IS NOT NULL THEN
UPDATE media
SET status = 'LINKED'
WHERE id = NEW.profile_image_id
  AND status <> 'DELETED';
END IF;

  IF NEW.profile_cover_id IS NOT NULL THEN
UPDATE media
SET status = 'LINKED'
WHERE id = NEW.profile_cover_id
  AND status <> 'DELETED';
END IF;

RETURN NEW;
END;
$$;

CREATE TRIGGER trg_org_profile_media_mark_linked
    AFTER INSERT OR UPDATE ON organizations
                        FOR EACH ROW
                        EXECUTE FUNCTION trg_org_profile_media_mark_linked();

-- ======================================================================
-- CONSUMERS
-- ======================================================================
CREATE TABLE consumers (
                           account_id       UUID PRIMARY KEY REFERENCES accounts(id) ON DELETE CASCADE,
                           display_name     TEXT        NOT NULL,
                           website          TEXT        NOT NULL,
                           industry_id      BIGINT      NOT NULL REFERENCES industries(id),
                           established      DATE        NOT NULL,

                           interests        TEXT,
                           size             TEXT,
                           phone            TEXT,
                           country          TEXT,
                           state            TEXT,
                           city             TEXT,

                           views            INT         DEFAULT 0,

                           profile_image_id UUID,
                           profile_cover_id UUID,

                           created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
                           updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),

                           CONSTRAINT fk_consumer_profile_image_media
                               FOREIGN KEY (profile_image_id) REFERENCES media(id) ON DELETE SET NULL,
                           CONSTRAINT fk_consumer_profile_cover_media
                               FOREIGN KEY (profile_cover_id) REFERENCES media(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS idx_consumer_industry_id
    ON consumers(industry_id);

DROP TRIGGER IF EXISTS trg_consumers_updated_at ON consumers;
CREATE TRIGGER trg_consumers_updated_at
    BEFORE UPDATE ON consumers
    FOR EACH ROW
    EXECUTE FUNCTION trg_touch_updated_at();

CREATE OR REPLACE FUNCTION trg_consumer_profile_media_mark_linked()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  ------------------------------------------------------------------
  -- 1) On UPDATE: unlink old media if the reference changed
  ------------------------------------------------------------------
  IF TG_OP = 'UPDATE' THEN
    -- profile_image_id changed or removed
    IF OLD.profile_image_id IS NOT NULL
       AND OLD.profile_image_id IS DISTINCT FROM NEW.profile_image_id THEN
UPDATE media
SET status = 'UNLINKED'
WHERE id = OLD.profile_image_id
  AND status <> 'DELETED';
END IF;

    -- profile_cover_id changed or removed
    IF OLD.profile_cover_id IS NOT NULL
       AND OLD.profile_cover_id IS DISTINCT FROM NEW.profile_cover_id THEN
UPDATE media
SET status = 'UNLINKED'
WHERE id = OLD.profile_cover_id
  AND status <> 'DELETED';
END IF;
END IF;

  ------------------------------------------------------------------
  -- 2) On INSERT OR UPDATE: mark new media as LINKED
  ------------------------------------------------------------------
  IF NEW.profile_image_id IS NOT NULL THEN
UPDATE media
SET status = 'LINKED'
WHERE id = NEW.profile_image_id
  AND status <> 'DELETED';
END IF;

  IF NEW.profile_cover_id IS NOT NULL THEN
UPDATE media
SET status = 'LINKED'
WHERE id = NEW.profile_cover_id
  AND status <> 'DELETED';
END IF;

RETURN NEW;
END;
$$;

CREATE TRIGGER trg_consumer_profile_media_mark_linked
    AFTER INSERT OR UPDATE ON consumers
                        FOR EACH ROW
                        EXECUTE FUNCTION trg_consumer_profile_media_mark_linked();

-- ======================================================================
-- SUCCESS STORIES
-- ======================================================================
CREATE TABLE IF NOT EXISTS success_stories (
                                               id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id     UUID        NOT NULL REFERENCES organizations(account_id) ON DELETE CASCADE,
    title      TEXT        NOT NULL,
    body       TEXT        NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

CREATE TRIGGER trg_success_stories_touch
    BEFORE UPDATE ON success_stories
    FOR EACH ROW
    EXECUTE FUNCTION trg_touch_updated_at();

-- Join table
CREATE TABLE success_story_media (
                                     success_story_id UUID NOT NULL REFERENCES success_stories(id) ON DELETE CASCADE,
                                     media_id         UUID NOT NULL REFERENCES media(id)           ON DELETE CASCADE,
                                     PRIMARY KEY (success_story_id, media_id)
);

-- When a row is added -> media becomes LINKED
CREATE OR REPLACE FUNCTION trg_success_story_media_insert_mark_linked()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
UPDATE media
SET status = 'LINKED'
WHERE id = NEW.media_id
  AND status <> 'DELETED';  -- optional protection

RETURN NEW;
END;
$$;

CREATE TRIGGER trg_success_story_media_insert_mark_linked
    AFTER INSERT ON success_story_media
    FOR EACH ROW
    EXECUTE FUNCTION trg_success_story_media_insert_mark_linked();

-- When a row is deleted -> media becomes DELETED
CREATE OR REPLACE FUNCTION trg_success_story_media_delete()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
UPDATE media
SET status = 'DELETED'
WHERE id = OLD.media_id;

RETURN OLD;
END;
$$;

CREATE TRIGGER trg_success_story_media_delete
    AFTER DELETE ON success_story_media
    FOR EACH ROW
    EXECUTE FUNCTION trg_success_story_media_delete();

-- ======================================================================
-- VERIFICATION CODE
-- ======================================================================
CREATE TABLE verification_code (
                                   id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                   user_id       UUID NULL REFERENCES accounts(id) ON DELETE SET NULL,

                                   channel       TEXT NOT NULL DEFAULT 'EMAIL'
                                       CHECK (channel IN ('EMAIL','SMS')),
                                   status        TEXT NOT NULL DEFAULT 'PENDING'
                                       CHECK (status IN ('PENDING','VERIFIED','EXPIRED','LOCKED','CANCELLED')),

                                   code_hash     TEXT        NOT NULL,
                                   expires_at    TIMESTAMPTZ NOT NULL,
                                   attempt_count INT         NOT NULL DEFAULT 0,
                                   resend_count  INT         NOT NULL DEFAULT 0,
                                   created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
                                   updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_verification_code_status_expires
    ON verification_code(status, expires_at);

CREATE INDEX IF NOT EXISTS idx_verification_code_user_recent
    ON verification_code(user_id, created_at DESC);

CREATE TRIGGER trg_verification_code_touch
    BEFORE UPDATE ON verification_code
    FOR EACH ROW
    EXECUTE FUNCTION trg_touch_updated_at();

-- ======================================================================
-- REFRESH TOKEN
-- ======================================================================
CREATE TABLE IF NOT EXISTS refresh_token (
                                             token_id     UUID PRIMARY KEY,
                                             user_id      UUID REFERENCES accounts(id),
    refresh_token TEXT        NOT NULL UNIQUE,
    expiry_date   TIMESTAMPTZ NOT NULL,
    created_date  TIMESTAMPTZ NOT NULL DEFAULT now(),
    valid         BOOLEAN     NOT NULL DEFAULT TRUE
    );

CREATE INDEX IF NOT EXISTS idx_refresh_token_user_valid_exp
    ON refresh_token (user_id, valid, expiry_date);

CREATE INDEX IF NOT EXISTS idx_refresh_token_valid_expiry
    ON refresh_token (valid, expiry_date);

-- ======================================================================
-- ACCOUNT EMAIL CHANGE LOG
-- ======================================================================
CREATE TABLE account_email_change_log (
                                          id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
                                          account_id UUID        NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
                                          old_email  TEXT        NOT NULL,
                                          new_email  TEXT        NOT NULL,
                                          changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_account_email_change_log_account_time
    ON account_email_change_log (account_id, changed_at DESC);

CREATE OR REPLACE FUNCTION trg_log_email_change()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.email IS DISTINCT FROM OLD.email THEN
    INSERT INTO account_email_change_log (account_id, old_email, new_email, changed_at)
    VALUES (OLD.id, OLD.email, NEW.email, now());
END IF;
RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_accounts_log_email_change ON accounts;

CREATE TRIGGER trg_accounts_log_email_change
    AFTER UPDATE OF email ON accounts
    FOR EACH ROW
    EXECUTE FUNCTION trg_log_email_change();

-- ======================================================================
-- TESTIMONIALS + ORG RATING AGGREGATION
-- ======================================================================
CREATE TABLE testimonials (
                              id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                              organization_id     UUID NOT NULL REFERENCES organizations(account_id) ON DELETE CASCADE,
                              consumer_account_id UUID NOT NULL REFERENCES consumers(account_id) ON DELETE CASCADE,
                              rating              SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
                              consumer_name       VARCHAR(120),
                              comment             TEXT NOT NULL,
                              created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
                              updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),

                              CONSTRAINT uk_testimonial_org_consumer UNIQUE (organization_id, consumer_account_id)
);

CREATE INDEX IF NOT EXISTS idx_testimonials_org
    ON testimonials(organization_id);

CREATE INDEX IF NOT EXISTS idx_testimonials_org_created_at
    ON testimonials(organization_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_testimonials_org_rating
    ON testimonials(organization_id, rating);

CREATE TRIGGER trg_testimonials_touch_updated_at
    BEFORE UPDATE ON testimonials
    FOR EACH ROW
    EXECUTE FUNCTION trg_touch_updated_at();

CREATE OR REPLACE FUNCTION trg_update_org_reviews()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
org_id UUID;
BEGIN
  IF TG_OP = 'INSERT' THEN
    org_id := NEW.organization_id;

UPDATE organizations
SET reviews_count = reviews_count + 1,
    rating_sum    = rating_sum + NEW.rating
WHERE account_id = org_id;

RETURN NEW;

ELSIF TG_OP = 'UPDATE' THEN
    org_id := NEW.organization_id;

    IF NEW.organization_id = OLD.organization_id THEN
      IF NEW.rating <> OLD.rating THEN
UPDATE organizations
SET rating_sum = rating_sum - OLD.rating + NEW.rating
WHERE account_id = org_id;
END IF;
END IF;

RETURN NEW;

ELSIF TG_OP = 'DELETE' THEN
    org_id := OLD.organization_id;

UPDATE organizations
SET reviews_count = reviews_count - 1,
    rating_sum    = rating_sum - OLD.rating
WHERE account_id = org_id;

RETURN OLD;
END IF;
END;
$$;

CREATE TRIGGER trg_testimonial_reviews
    AFTER INSERT OR UPDATE OR DELETE
                    ON testimonials
                        FOR EACH ROW
                        EXECUTE FUNCTION trg_update_org_reviews();

CREATE TABLE success_story_hashtags (
                                        success_story_id UUID NOT NULL REFERENCES success_stories(id) ON DELETE CASCADE,
                                        hashtag_id       BIGINT NOT NULL REFERENCES hashtags(id) ON DELETE CASCADE,
                                        PRIMARY KEY (success_story_id, hashtag_id)
);

-- ======================================================================
-- CAPABILITIES
-- ======================================================================
CREATE TABLE IF NOT EXISTS capabilities (
                                            id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id     UUID        NOT NULL REFERENCES organizations(account_id) ON DELETE CASCADE,
    title      TEXT        NOT NULL,
    body       TEXT        NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

CREATE TRIGGER trg_capabilities_touch
    BEFORE UPDATE ON capabilities
    FOR EACH ROW
    EXECUTE FUNCTION trg_touch_updated_at();

CREATE TABLE IF NOT EXISTS capability_hashtags (
                                                   capability_id UUID  NOT NULL REFERENCES capabilities(id) ON DELETE CASCADE,
    hashtag_id    BIGINT NOT NULL REFERENCES hashtags(id) ON DELETE CASCADE,
    PRIMARY KEY (capability_id, hashtag_id)
    );

-- ======================================================================
-- CERTIFICATES
-- ======================================================================
CREATE TABLE IF NOT EXISTS certificates (
                                            id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id           UUID        NOT NULL REFERENCES organizations(account_id) ON DELETE CASCADE,
    image_id         UUID        NOT NULL REFERENCES media(id),
    title            TEXT        NOT NULL,
    body             TEXT,
    link             TEXT,
    certificate_date DATE        NOT NULL,
    verified         BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
    );

CREATE TRIGGER trg_certificates_touch
    BEFORE UPDATE ON certificates
    FOR EACH ROW
    EXECUTE FUNCTION trg_touch_updated_at();

-- Mark media as LINKED/UNLINKED when certificate image changes
CREATE OR REPLACE FUNCTION trg_certificate_media_mark_linked()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  ------------------------------------------------------------------
  -- 1) On UPDATE: DELETED old media if the image changed
  ------------------------------------------------------------------
  IF TG_OP = 'UPDATE' THEN
    IF OLD.image_id IS NOT NULL
       AND OLD.image_id IS DISTINCT FROM NEW.image_id THEN
UPDATE media
SET status = 'DELETED'
WHERE id = OLD.image_id
  AND status <> 'DELETED';
END IF;
END IF;

  ------------------------------------------------------------------
  -- 2) On INSERT / UPDATE: mark new image as LINKED
  ------------------------------------------------------------------
  IF NEW.image_id IS NOT NULL THEN
UPDATE media
SET status = 'LINKED'
WHERE id = NEW.image_id
  AND status <> 'DELETED';
END IF;

RETURN NEW;
END;
$$;

CREATE TRIGGER trg_certificate_media_mark_linked
    AFTER INSERT OR UPDATE ON certificates
                        FOR EACH ROW
                        EXECUTE FUNCTION trg_certificate_media_mark_linked();

CREATE OR REPLACE FUNCTION trg_certificate_media_unlink_on_delete()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.image_id IS NOT NULL THEN
UPDATE media
SET status = 'DELETED'
WHERE id = OLD.image_id
  AND status <> 'DELETED';
END IF;
RETURN OLD;
END;
$$;

CREATE TRIGGER trg_certificate_media_unlink_on_delete
    AFTER DELETE ON certificates
    FOR EACH ROW
    EXECUTE FUNCTION trg_certificate_media_unlink_on_delete();

-- ======================================================================
-- EVENTS
-- ======================================================================
CREATE TABLE events (
                        id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                        org_id           UUID        NOT NULL REFERENCES organizations(account_id) ON DELETE CASCADE,

                        title            TEXT        NOT NULL,
                        body             TEXT,

                        mode             TEXT        NOT NULL
                            CHECK (mode IN ('ONLINE','OFFLINE')),

                        industry_id      BIGINT REFERENCES industries(id),

                        country          TEXT,
                        state            TEXT,
                        city             TEXT,
                        address          TEXT,
                        start_at         TIMESTAMPTZ NOT NULL,
                        end_at           TIMESTAMPTZ,

                        online_link      TEXT,

                        viewers          BIGINT      NOT NULL DEFAULT 0,
                        registered_count BIGINT      NOT NULL DEFAULT 0,

                        created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
                        updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_industry_id
    ON events(industry_id);

CREATE TRIGGER trg_events_touch
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION trg_touch_updated_at();

-- ======================================================================
-- EVENT MEDIA (many images / videos per event)
-- ======================================================================
CREATE TABLE event_media (
                             event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
                             media_id UUID NOT NULL REFERENCES media(id)  ON DELETE CASCADE,
                             PRIMARY KEY (event_id, media_id)
);

-- When a row is added -> media becomes LINKED
CREATE OR REPLACE FUNCTION trg_event_media_insert_mark_linked()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
UPDATE media
SET status = 'LINKED'
WHERE id = NEW.media_id
  AND status <> 'DELETED';

RETURN NEW;
END;
$$;

CREATE TRIGGER trg_event_media_insert_mark_linked
    AFTER INSERT ON event_media
    FOR EACH ROW
    EXECUTE FUNCTION trg_event_media_insert_mark_linked();

-- When a row is deleted -> media becomes DELETED (same behavior as success_story_media)
CREATE OR REPLACE FUNCTION trg_event_media_delete()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
UPDATE media
SET status = 'DELETED'
WHERE id = OLD.media_id;

RETURN OLD;
END;
$$;

CREATE TRIGGER trg_event_media_delete
    AFTER DELETE ON event_media
    FOR EACH ROW
    EXECUTE FUNCTION trg_event_media_delete();

-- ======================================================================
-- EVENT REGISTRATIONS
-- ======================================================================
CREATE TABLE event_registrations (
                                     id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                     event_id    UUID        NOT NULL REFERENCES events(id)    ON DELETE CASCADE,
                                     account_id  UUID        NOT NULL REFERENCES accounts(id)  ON DELETE CASCADE,

                                     status      TEXT        NOT NULL DEFAULT 'REGISTERED'
                                         CHECK (status IN ('REGISTERED','CANCELLED')),

                                     created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
                                     updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

                                     CONSTRAINT uk_event_registration UNIQUE (event_id, account_id)
);

CREATE TRIGGER trg_event_registrations_touch
    BEFORE UPDATE ON event_registrations
    FOR EACH ROW
    EXECUTE FUNCTION trg_touch_updated_at();

-- keep events.registered_count in sync
CREATE OR REPLACE FUNCTION trg_update_event_registered_count()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
v_event_id UUID;
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_event_id := NEW.event_id;

    IF NEW.status = 'REGISTERED' THEN
UPDATE events
SET registered_count = registered_count + 1
WHERE id = v_event_id;
END IF;

RETURN NEW;

ELSIF TG_OP = 'UPDATE' THEN
    v_event_id := NEW.event_id;

    IF OLD.status = 'REGISTERED' AND NEW.status <> 'REGISTERED' THEN
UPDATE events
SET registered_count = registered_count - 1
WHERE id = v_event_id;
ELSIF OLD.status <> 'REGISTERED' AND NEW.status = 'REGISTERED' THEN
UPDATE events
SET registered_count = registered_count + 1
WHERE id = v_event_id;
END IF;

RETURN NEW;

ELSIF TG_OP = 'DELETE' THEN
    v_event_id := OLD.event_id;

    IF OLD.status = 'REGISTERED' THEN
UPDATE events
SET registered_count = registered_count - 1
WHERE id = v_event_id;
END IF;

RETURN OLD;
END IF;
END;
$$;

CREATE TRIGGER trg_event_registrations_count
    AFTER INSERT OR UPDATE OR DELETE ON event_registrations
    FOR EACH ROW
    EXECUTE FUNCTION trg_update_event_registered_count();

-- ======================================================================
-- POSTS (ORG ONLY)
-- ======================================================================
CREATE TABLE posts (
                       id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                       org_id           UUID        NOT NULL REFERENCES organizations(account_id) ON DELETE CASCADE,

                       body             TEXT        NOT NULL,

                       reactions_count  BIGINT      NOT NULL DEFAULT 0,
                       comments_count   BIGINT      NOT NULL DEFAULT 0,
                       views            BIGINT      NOT NULL DEFAULT 0,

                       created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
                       updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_posts_touch
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION trg_touch_updated_at();

-- ======================================================================
-- POST MEDIA (images / videos / files)
-- ======================================================================
CREATE TABLE post_media (
                            post_id  UUID NOT NULL REFERENCES posts(id)  ON DELETE CASCADE,
                            media_id UUID NOT NULL REFERENCES media(id)  ON DELETE CASCADE,
                            PRIMARY KEY (post_id, media_id)
);

-- mark media as LINKED when attached to a post
CREATE OR REPLACE FUNCTION trg_post_media_insert_mark_linked()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
UPDATE media
SET status = 'LINKED'
WHERE id = NEW.media_id
  AND status <> 'DELETED';

RETURN NEW;
END;
$$;

CREATE TRIGGER trg_post_media_insert_mark_linked
    AFTER INSERT ON post_media
    FOR EACH ROW
    EXECUTE FUNCTION trg_post_media_insert_mark_linked();

-- when detached from post -> mark DELETED (same convention as success stories)
CREATE OR REPLACE FUNCTION trg_post_media_delete()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
UPDATE media
SET status = 'DELETED'
WHERE id = OLD.media_id;

RETURN OLD;
END;
$$;

CREATE TRIGGER trg_post_media_delete
    AFTER DELETE ON post_media
    FOR EACH ROW
    EXECUTE FUNCTION trg_post_media_delete();

-- ======================================================================
-- POST REACTIONS (positive only, like LinkedIn)
-- ======================================================================
CREATE TABLE post_reactions (
                                id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                post_id     UUID        NOT NULL REFERENCES posts(id)     ON DELETE CASCADE,
                                account_id  UUID        NOT NULL REFERENCES accounts(id)  ON DELETE CASCADE,

                                reaction    TEXT        NOT NULL
                                    CHECK (reaction IN ('LIKE','CELEBRATE','SUPPORT','LOVE','INSIGHTFUL','CURIOUS')),

                                created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
                                updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

                                CONSTRAINT uk_post_reaction UNIQUE (post_id, account_id)
);

CREATE TRIGGER trg_post_reactions_touch
    BEFORE UPDATE ON post_reactions
    FOR EACH ROW
    EXECUTE FUNCTION trg_touch_updated_at();

CREATE OR REPLACE FUNCTION trg_update_post_reactions_count()
RETURNS trigger LANGUAGE plpgsql AS $$

DECLARE
v_post_id UUID;
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_post_id := NEW.post_id;
UPDATE posts
SET reactions_count = reactions_count + 1
WHERE id = v_post_id;
RETURN NEW;

ELSIF TG_OP = 'DELETE' THEN
    v_post_id := OLD.post_id;
UPDATE posts
SET reactions_count = reactions_count - 1
WHERE id = v_post_id;
RETURN OLD;

ELSIF TG_OP = 'UPDATE' THEN
    -- reaction type changed, but still one reaction => count unchanged
    RETURN NEW;
END IF;
END;
$$;

CREATE TRIGGER trg_post_reactions_count
    AFTER INSERT OR DELETE ON post_reactions
    FOR EACH ROW
    EXECUTE FUNCTION trg_update_post_reactions_count();

-- ======================================================================
-- POST COMMENTS
-- ======================================================================
CREATE TABLE post_comments (
                               id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                               post_id           UUID        NOT NULL REFERENCES posts(id)    ON DELETE CASCADE,
                               account_id        UUID        NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,

                               body              TEXT        NOT NULL,
                               parent_comment_id UUID NULL REFERENCES post_comments(id) ON DELETE CASCADE,

                               created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
                               updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_post_comments_touch
    BEFORE UPDATE ON post_comments
    FOR EACH ROW
    EXECUTE FUNCTION trg_touch_updated_at();

CREATE OR REPLACE FUNCTION trg_update_post_comments_count()
RETURNS trigger LANGUAGE plpgsql AS $$

DECLARE
v_post_id UUID;
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_post_id := NEW.post_id;
UPDATE posts
SET comments_count = comments_count + 1
WHERE id = v_post_id;
RETURN NEW;

ELSIF TG_OP = 'DELETE' THEN
    v_post_id := OLD.post_id;
UPDATE posts
SET comments_count = comments_count - 1
WHERE id = v_post_id;
RETURN OLD;

ELSIF TG_OP = 'UPDATE' THEN
    RETURN NEW;
END IF;
END;
$$;

CREATE TRIGGER trg_post_comments_count
    AFTER INSERT OR DELETE ON post_comments
    FOR EACH ROW
    EXECUTE FUNCTION trg_update_post_comments_count();
-- ======================================================================
-- NOTIFICATIONS (IN-APP + SETTINGS + DELIVERY + OUTBOX)
-- ======================================================================

-- 1) Notification settings per account
CREATE TABLE notification_settings (
                                       account_id  UUID PRIMARY KEY REFERENCES accounts(id) ON DELETE CASCADE,

                                       in_app_enabled BOOLEAN NOT NULL DEFAULT TRUE,
                                       email_enabled  BOOLEAN NOT NULL DEFAULT FALSE,
                                       sms_enabled    BOOLEAN NOT NULL DEFAULT FALSE,

    -- per-type/channel preferences: {"POST_COMMENTED":{"in_app":true,"email":false}}
                                       preferences    JSONB NOT NULL DEFAULT '{}'::jsonb,

                                       created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
                                       updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_notification_settings_touch
    BEFORE UPDATE ON notification_settings
    FOR EACH ROW
    EXECUTE FUNCTION trg_touch_updated_at();


-- 2) Notification master record (one activity event)
CREATE TABLE notifications (
                               id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

                               type             TEXT NOT NULL,
                               actor_account_id UUID NULL REFERENCES accounts(id) ON DELETE SET NULL,

                               target_kind      TEXT NULL,   -- POST, EVENT, TESTIMONIAL, ORG, COMMENT ...
                               target_id        UUID NULL,

                               payload          JSONB NOT NULL DEFAULT '{}'::jsonb,

                               created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
                               updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_created_at
    ON notifications(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_actor
    ON notifications(actor_account_id, created_at DESC);

CREATE TRIGGER trg_notifications_touch
    BEFORE UPDATE ON notifications
    FOR EACH ROW
    EXECUTE FUNCTION trg_touch_updated_at();


-- 3) Notification recipients (many recipients per notification)
CREATE TABLE notification_recipients (
                                         notification_id      UUID NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
                                         recipient_account_id UUID NOT NULL REFERENCES accounts(id)      ON DELETE CASCADE,

                                         dedupe_key           TEXT NULL,       -- used to prevent spam/duplicates
                                         read_at              TIMESTAMPTZ NULL,

                                         created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),

                                         CONSTRAINT pk_notification_recipients
                                             PRIMARY KEY (notification_id, recipient_account_id)
);

CREATE INDEX IF NOT EXISTS idx_notif_recipients_recipient_time
    ON notification_recipients(recipient_account_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notif_recipients_unread
    ON notification_recipients(recipient_account_id, read_at)
    WHERE read_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uk_notif_recipients_dedupe
    ON notification_recipients(recipient_account_id, dedupe_key)
    WHERE dedupe_key IS NOT NULL;


-- 4) Delivery attempts (email/sms/push later)
CREATE TABLE notification_delivery_attempts (
                                                id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                                notification_id      UUID NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
                                                recipient_account_id UUID NOT NULL REFERENCES accounts(id)      ON DELETE CASCADE,

                                                channel             TEXT NOT NULL CHECK (channel IN ('EMAIL','SMS','PUSH')),
                                                status              TEXT NOT NULL DEFAULT 'PENDING'
                                                    CHECK (status IN ('PENDING','SENT','FAILED','CANCELLED')),

                                                attempt_count       INT  NOT NULL DEFAULT 0,
                                                next_retry_at       TIMESTAMPTZ NULL,
                                                last_error          TEXT NULL,

                                                created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
                                                updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notif_delivery_pending
    ON notification_delivery_attempts(status, next_retry_at);

CREATE TRIGGER trg_notif_delivery_touch
    BEFORE UPDATE ON notification_delivery_attempts
    FOR EACH ROW
    EXECUTE FUNCTION trg_touch_updated_at();


-- 5) Outbox events (reliable processing pattern)
CREATE TABLE outbox_events (
                               id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                               event_type    TEXT NOT NULL,     -- store NotificationType name
                               payload       JSONB NOT NULL,

                               status        TEXT NOT NULL DEFAULT 'PENDING'
                                   CHECK (status IN ('PENDING','PROCESSING','PROCESSED','FAILED')),

                               attempt_count INT NOT NULL DEFAULT 0,
                               next_retry_at TIMESTAMPTZ NULL,

                               created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
                               updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_outbox_pending
    ON outbox_events(status, next_retry_at, created_at);

CREATE TRIGGER trg_outbox_events_touch
    BEFORE UPDATE ON outbox_events
    FOR EACH ROW
    EXECUTE FUNCTION trg_touch_updated_at();
