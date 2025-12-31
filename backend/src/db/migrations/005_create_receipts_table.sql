-- Up Migration
CREATE TABLE receipts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL,
    
    -- Parties
    payer_wallet_id UUID NOT NULL REFERENCES wallets(id),
    payee_wallet_id UUID NOT NULL REFERENCES wallets(id),
    
    -- Transaction details
    amount DECIMAL(18, 4) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'PGK',
    description TEXT,
    
    -- Receipt data
    receipt_number VARCHAR(20) NOT NULL UNIQUE,
    
    -- Confirmation
    payer_name VARCHAR(100),
    payee_name VARCHAR(100),
    confirmed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Audio confirmation tracking
    audio_played BOOLEAN DEFAULT FALSE,
    audio_played_at TIMESTAMP WITH TIME ZONE,
    
    -- For printable receipts
    print_count INTEGER DEFAULT 0,
    last_printed_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_receipt_transaction ON receipts(transaction_id);
CREATE INDEX idx_receipt_payer ON receipts(payer_wallet_id);
CREATE INDEX idx_receipt_payee ON receipts(payee_wallet_id);
CREATE INDEX idx_receipt_number ON receipts(receipt_number);

-- Down Migration
DROP TABLE IF EXISTS receipts;
