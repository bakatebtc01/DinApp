-- Up Migration

-- Gift catalog (available gifts)
CREATE TABLE gift_catalog (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url TEXT,
    
    -- Pricing
    price DECIMAL(18, 4) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'PGK',
    
    -- Display
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    is_premium BOOLEAN DEFAULT FALSE,
    
    -- Animation/effect identifier for frontend
    effect_type VARCHAR(50),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Individual gift transactions
CREATE TABLE gift_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Session context
    session_id UUID NOT NULL REFERENCES livestream_sessions(id),
    gift_id UUID NOT NULL REFERENCES gift_catalog(id),
    
    -- Parties
    sender_wallet_id UUID NOT NULL REFERENCES wallets(id),
    receiver_wallet_id UUID NOT NULL REFERENCES wallets(id), -- Creator
    
    -- Gift details
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(18, 4) NOT NULL,
    total_amount DECIMAL(18, 4) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'PGK',
    
    -- Revenue split (55% creator / 45% platform)
    creator_amount DECIMAL(18, 4) NOT NULL,
    platform_amount DECIMAL(18, 4) NOT NULL,
    
    -- Ledger reference
    transaction_id UUID NOT NULL,
    
    -- Message from sender
    message TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_gift_tx_session ON gift_transactions(session_id);
CREATE INDEX idx_gift_tx_sender ON gift_transactions(sender_wallet_id);
CREATE INDEX idx_gift_tx_receiver ON gift_transactions(receiver_wallet_id);
CREATE INDEX idx_gift_catalog_active ON gift_catalog(is_active);

-- Seed some default gifts
INSERT INTO gift_catalog (name, description, price, sort_order, effect_type) VALUES
    ('Heart', 'Show some love', 1.00, 1, 'heart_float'),
    ('Star', 'You are a star!', 5.00, 2, 'star_burst'),
    ('Rose', 'A beautiful rose', 10.00, 3, 'rose_fall'),
    ('Crown', 'Crown the king/queen', 25.00, 4, 'crown_drop'),
    ('Rocket', 'To the moon!', 50.00, 5, 'rocket_launch'),
    ('Diamond', 'Premium diamond', 100.00, 6, 'diamond_shine'),
    ('Castle', 'Build a castle', 500.00, 7, 'castle_build'),
    ('Treasure', 'Ultimate treasure chest', 1000.00, 8, 'treasure_open');

-- Down Migration
DROP TABLE IF EXISTS gift_transactions;
DROP TABLE IF EXISTS gift_catalog;
