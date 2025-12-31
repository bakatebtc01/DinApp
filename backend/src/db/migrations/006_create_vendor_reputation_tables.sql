-- Up Migration
CREATE TABLE vendor_reputation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_wallet_id UUID NOT NULL REFERENCES wallets(id) UNIQUE,
    
    -- Reputation metrics
    total_transactions INTEGER DEFAULT 0,
    successful_transactions INTEGER DEFAULT 0,
    disputed_transactions INTEGER DEFAULT 0,
    
    -- Ratings (1-5 scale)
    total_ratings INTEGER DEFAULT 0,
    rating_sum INTEGER DEFAULT 0,
    average_rating DECIMAL(3, 2) DEFAULT 0.00,
    
    -- Trust score (calculated)
    trust_score DECIMAL(5, 2) DEFAULT 100.00, -- 0-100
    
    -- Flags
    is_verified BOOLEAN DEFAULT FALSE,
    is_flagged BOOLEAN DEFAULT FALSE,
    flag_reason TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Individual ratings log
CREATE TABLE vendor_ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_wallet_id UUID NOT NULL REFERENCES wallets(id),
    payer_wallet_id UUID NOT NULL REFERENCES wallets(id),
    transaction_id UUID NOT NULL,
    
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- One rating per transaction
    CONSTRAINT uq_transaction_rating UNIQUE (transaction_id)
);

CREATE INDEX idx_vendor_rep_merchant ON vendor_reputation(merchant_wallet_id);
CREATE INDEX idx_vendor_ratings_merchant ON vendor_ratings(merchant_wallet_id);

-- Down Migration
DROP TABLE IF EXISTS vendor_ratings;
DROP TABLE IF EXISTS vendor_reputation;
