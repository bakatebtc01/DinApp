-- Up Migration
CREATE TYPE queue_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'expired');

CREATE TABLE payment_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Payment details (stored for retry)
    payer_wallet_id UUID NOT NULL REFERENCES wallets(id),
    payee_wallet_id UUID NOT NULL REFERENCES wallets(id),
    amount DECIMAL(18, 4) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'PGK',
    qr_code_id UUID REFERENCES qr_codes(id),
    
    -- Queue metadata
    status queue_status NOT NULL DEFAULT 'pending',
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_attempt_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Result
    transaction_id UUID,
    error_message TEXT,
    
    -- Device info for offline context
    device_id VARCHAR(255),
    offline_signature TEXT -- For verification when coming back online
);

CREATE INDEX idx_queue_status ON payment_queue(status);
CREATE INDEX idx_queue_payer ON payment_queue(payer_wallet_id);
CREATE INDEX idx_queue_expires ON payment_queue(expires_at);

-- Down Migration
DROP TABLE IF EXISTS payment_queue;
DROP TYPE IF EXISTS queue_status;
