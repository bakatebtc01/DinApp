-- Up Migration
CREATE TYPE wallet_type AS ENUM ('personal', 'creator', 'merchant', 'agent', 'escrow', 'platform');
CREATE TYPE wallet_status AS ENUM ('active', 'frozen', 'closed');

CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    wallet_type wallet_type NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'PGK',
    balance DECIMAL(18, 4) NOT NULL DEFAULT 0.0000,
    status wallet_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure balance never goes negative via check constraint
    CONSTRAINT positive_balance CHECK (balance >= 0),
    -- One wallet per type per user (except escrow which can have multiple)
    CONSTRAINT uq_user_wallet_type UNIQUE (user_id, wallet_type)
);

-- Create index for faster lookups
CREATE INDEX idx_wallets_user_id ON wallets(user_id);
CREATE INDEX idx_wallets_type ON wallets(wallet_type);

-- Down Migration
DROP TABLE IF EXISTS wallets;
DROP TYPE IF EXISTS wallet_status;
DROP TYPE IF EXISTS wallet_type;
