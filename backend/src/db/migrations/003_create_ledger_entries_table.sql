-- Up Migration
CREATE TYPE entry_type AS ENUM ('debit', 'credit');
CREATE TYPE transaction_type AS ENUM (
    'transfer', 
    'gift', 
    'subscription', 
    'loan_disbursement', 
    'loan_repayment', 
    'platform_fee', 
    'agent_payout', 
    'agent_deposit',
    'escrow_lock',
    'escrow_release'
);

CREATE TABLE ledger_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL, -- Groups debit/credit pairs
    wallet_id UUID NOT NULL REFERENCES wallets(id),
    entry_type entry_type NOT NULL,
    transaction_type transaction_type NOT NULL,
    amount DECIMAL(18, 4) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'PGK',
    
    -- FX Locking: Store rate at transaction time
    fx_rate DECIMAL(12, 6) DEFAULT 1.000000,
    fx_base_currency VARCHAR(3) DEFAULT 'PGK',
    
    -- Reference for audit trail
    reference_id UUID, -- Links to gift, subscription, loan, etc.
    description TEXT,
    
    -- Immutability: No updates allowed after creation
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Running balance snapshot for audit
    balance_after DECIMAL(18, 4) NOT NULL,
    
    CONSTRAINT positive_amount CHECK (amount > 0)
);

-- Indexes for performance
CREATE INDEX idx_ledger_transaction_id ON ledger_entries(transaction_id);
CREATE INDEX idx_ledger_wallet_id ON ledger_entries(wallet_id);
CREATE INDEX idx_ledger_created_at ON ledger_entries(created_at);
CREATE INDEX idx_ledger_transaction_type ON ledger_entries(transaction_type);

-- Down Migration
DROP TABLE IF EXISTS ledger_entries;
DROP TYPE IF EXISTS transaction_type;
DROP TYPE IF EXISTS entry_type;
