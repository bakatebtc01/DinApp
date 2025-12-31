-- Up Migration
CREATE TYPE qr_type AS ENUM ('static', 'dynamic');
CREATE TYPE qr_status AS ENUM ('active', 'used', 'expired', 'cancelled');

CREATE TABLE qr_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_wallet_id UUID NOT NULL REFERENCES wallets(id),
    qr_type qr_type NOT NULL,
    
    -- Payment details
    amount DECIMAL(18, 4), -- NULL for static (any amount), set for dynamic
    currency VARCHAR(3) NOT NULL DEFAULT 'PGK',
    description TEXT,
    
    -- QR Data (encoded payload)
    qr_payload TEXT NOT NULL UNIQUE,
    
    -- Status tracking
    status qr_status NOT NULL DEFAULT 'active',
    expires_at TIMESTAMP WITH TIME ZONE, -- NULL for static (no expiry)
    used_at TIMESTAMP WITH TIME ZONE,
    
    -- Audit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- For dynamic QR, link to the resulting transaction
    transaction_id UUID
);

CREATE INDEX idx_qr_merchant ON qr_codes(merchant_wallet_id);
CREATE INDEX idx_qr_payload ON qr_codes(qr_payload);
CREATE INDEX idx_qr_status ON qr_codes(status);

-- Down Migration
DROP TABLE IF EXISTS qr_codes;
DROP TYPE IF EXISTS qr_status;
DROP TYPE IF EXISTS qr_type;
