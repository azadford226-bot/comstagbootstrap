-- ======================================================================
-- RFQ (Request for Quotation) System
-- ======================================================================

-- RFQs table
CREATE TABLE rfqs (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id     UUID        NOT NULL REFERENCES organizations(account_id) ON DELETE CASCADE,
    
    title               TEXT        NOT NULL,
    description         TEXT        NOT NULL,
    category            TEXT,
    industry_id         BIGINT      REFERENCES industries(id),
    
    budget              DECIMAL(15, 2),
    budget_currency     VARCHAR(3)  NOT NULL DEFAULT 'USD',
    deadline            TIMESTAMPTZ,
    requirements        TEXT,
    
    status              VARCHAR(50) NOT NULL DEFAULT 'OPEN'
        CHECK (status IN ('OPEN', 'CLOSED', 'AWARDED', 'CANCELLED')),
    visibility          VARCHAR(50) NOT NULL DEFAULT 'PUBLIC'
        CHECK (visibility IN ('PUBLIC', 'INVITE_ONLY', 'PRIVATE')),
    
    awarded_to_id       UUID        REFERENCES organizations(account_id) ON DELETE SET NULL,
    
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT fk_rfq_organization
        FOREIGN KEY (organization_id) REFERENCES organizations(account_id)
);

CREATE INDEX idx_rfqs_organization_id ON rfqs(organization_id);
CREATE INDEX idx_rfqs_status ON rfqs(status);
CREATE INDEX idx_rfqs_industry_id ON rfqs(industry_id);
CREATE INDEX idx_rfqs_created_at ON rfqs(created_at DESC);
CREATE INDEX idx_rfqs_organization_status ON rfqs(organization_id, status);
CREATE INDEX idx_rfqs_status_created ON rfqs(status, created_at DESC);

CREATE TRIGGER trg_rfqs_touch
    BEFORE UPDATE ON rfqs
    FOR EACH ROW
    EXECUTE FUNCTION trg_touch_updated_at();

-- RFQ Proposals table
CREATE TABLE rfq_proposals (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rfq_id              UUID        NOT NULL REFERENCES rfqs(id) ON DELETE CASCADE,
    organization_id     UUID        NOT NULL REFERENCES organizations(account_id) ON DELETE CASCADE,
    
    proposal_text       TEXT        NOT NULL,
    price               DECIMAL(15, 2) NOT NULL,
    currency            VARCHAR(3)  NOT NULL DEFAULT 'USD',
    delivery_time       TEXT, -- e.g., "2 weeks", "30 days"
    
    status              VARCHAR(50) NOT NULL DEFAULT 'SUBMITTED'
        CHECK (status IN ('SUBMITTED', 'SHORTLISTED', 'ACCEPTED', 'REJECTED')),
    
    submitted_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT uk_rfq_proposal_rfq_org UNIQUE (rfq_id, organization_id),
    
    CONSTRAINT fk_rfq_proposal_rfq
        FOREIGN KEY (rfq_id) REFERENCES rfqs(id),
    CONSTRAINT fk_rfq_proposal_organization
        FOREIGN KEY (organization_id) REFERENCES organizations(account_id)
);

CREATE INDEX idx_rfq_proposals_rfq_id ON rfq_proposals(rfq_id);
CREATE INDEX idx_rfq_proposals_organization_id ON rfq_proposals(organization_id);
CREATE INDEX idx_rfq_proposals_status ON rfq_proposals(status);
CREATE INDEX idx_rfq_proposals_submitted_at ON rfq_proposals(submitted_at DESC);
CREATE INDEX idx_rfq_proposals_rfq_status ON rfq_proposals(rfq_id, status);

CREATE TRIGGER trg_rfq_proposals_touch
    BEFORE UPDATE ON rfq_proposals
    FOR EACH ROW
    EXECUTE FUNCTION trg_touch_updated_at();

-- RFQ Invited Organizations (for INVITE_ONLY RFQs)
CREATE TABLE rfq_invited_organizations (
    rfq_id              UUID NOT NULL REFERENCES rfqs(id) ON DELETE CASCADE,
    organization_id     UUID NOT NULL REFERENCES organizations(account_id) ON DELETE CASCADE,
    
    invited_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT pk_rfq_invited_orgs PRIMARY KEY (rfq_id, organization_id)
);

CREATE INDEX idx_rfq_invited_orgs_rfq ON rfq_invited_organizations(rfq_id);
CREATE INDEX idx_rfq_invited_orgs_org ON rfq_invited_organizations(organization_id);

-- RFQ Media attachments (reuse media table)
CREATE TABLE rfq_media (
    rfq_id              UUID NOT NULL REFERENCES rfqs(id) ON DELETE CASCADE,
    media_id            UUID NOT NULL REFERENCES media(id) ON DELETE CASCADE,
    
    PRIMARY KEY (rfq_id, media_id)
);

-- Mark media as LINKED when attached to RFQ
CREATE OR REPLACE FUNCTION trg_rfq_media_insert_mark_linked()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
UPDATE media
SET status = 'LINKED'
WHERE id = NEW.media_id
  AND status <> 'DELETED';

RETURN NEW;
END;
$$;

CREATE TRIGGER trg_rfq_media_insert_mark_linked
    AFTER INSERT ON rfq_media
    FOR EACH ROW
    EXECUTE FUNCTION trg_rfq_media_insert_mark_linked();

-- Mark media as DELETED when detached from RFQ
CREATE OR REPLACE FUNCTION trg_rfq_media_delete()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
UPDATE media
SET status = 'DELETED'
WHERE id = OLD.media_id;

RETURN OLD;
END;
$$;

CREATE TRIGGER trg_rfq_media_delete
    AFTER DELETE ON rfq_media
    FOR EACH ROW
    EXECUTE FUNCTION trg_rfq_media_delete();


