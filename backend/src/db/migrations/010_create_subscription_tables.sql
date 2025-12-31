-- Up Migration
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired', 'paused');
CREATE TYPE billing_status AS ENUM ('pending', 'paid', 'failed', 'refunded');

-- Subscription tiers (3 tiers per creator)
CREATE TABLE subscription_tiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_wallet_id UUID NOT NULL REFERENCES wallets(id),
    
    -- Tier details
    tier_level INTEGER NOT NULL CHECK (tier_level >= 1 AND tier_level <= 3),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    
    -- Pricing
    monthly_price DECIMAL(18, 4) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'PGK',
    
    -- Benefits
    benefits JSONB DEFAULT '[]', -- Array of benefit strings
    badge_icon VARCHAR(100), -- Icon identifier for the tier badge
    badge_color VARCHAR(20), -- Color for the badge
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- One tier per level per creator
    CONSTRAINT uq_creator_tier UNIQUE (creator_wallet_id, tier_level)
);

-- User subscriptions
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Parties
    subscriber_wallet_id UUID NOT NULL REFERENCES wallets(id),
    creator_wallet_id UUID NOT NULL REFERENCES wallets(id),
    tier_id UUID NOT NULL REFERENCES subscription_tiers(id),
    
    -- Status
    status subscription_status NOT NULL DEFAULT 'active',
    
    -- Billing cycle
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Auto-renew setting
    auto_renew BOOLEAN DEFAULT TRUE,
    
    -- Cancellation
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- One subscription per creator per subscriber
    CONSTRAINT uq_subscriber_creator UNIQUE (subscriber_wallet_id, creator_wallet_id)
);

-- Billing history
CREATE TABLE subscription_billing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id UUID NOT NULL REFERENCES subscriptions(id),
    
    -- Billing details
    amount DECIMAL(18, 4) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'PGK',
    
    -- Revenue split (55% creator / 45% platform)
    creator_amount DECIMAL(18, 4) NOT NULL,
    platform_amount DECIMAL(18, 4) NOT NULL,
    
    -- Period
    billing_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    billing_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Status
    status billing_status NOT NULL DEFAULT 'pending',
    
    -- Ledger reference
    transaction_id UUID,
    
    -- Retry tracking
    attempt_count INTEGER DEFAULT 0,
    last_attempt_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_tiers_creator ON subscription_tiers(creator_wallet_id);
CREATE INDEX idx_subs_subscriber ON subscriptions(subscriber_wallet_id);
CREATE INDEX idx_subs_creator ON subscriptions(creator_wallet_id);
CREATE INDEX idx_subs_status ON subscriptions(status);
CREATE INDEX idx_billing_subscription ON subscription_billing(subscription_id);
CREATE INDEX idx_billing_status ON subscription_billing(status);

-- Down Migration
DROP TABLE IF EXISTS subscription_billing;
DROP TABLE IF EXISTS subscriptions;
DROP TABLE IF EXISTS subscription_tiers;
DROP TYPE IF EXISTS billing_status;
DROP TYPE IF EXISTS subscription_status;
