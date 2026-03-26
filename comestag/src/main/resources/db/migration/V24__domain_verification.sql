CREATE TABLE IF NOT EXISTS domain_verifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID NOT NULL,
    domain VARCHAR(255) NOT NULL,
    verification_token VARCHAR(255) NOT NULL,
    verification_method VARCHAR(50) DEFAULT 'DNS_TXT',
    verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT now(),
    UNIQUE(org_id, domain)
);
