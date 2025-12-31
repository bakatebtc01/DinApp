-- Up Migration
CREATE TYPE stream_status AS ENUM ('scheduled', 'live', 'ended', 'cancelled');

CREATE TABLE livestream_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_wallet_id UUID NOT NULL REFERENCES wallets(id),
    creator_user_id UUID NOT NULL REFERENCES users(id),
    
    -- Session details
    title VARCHAR(200) NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    
    -- Status tracking
    status stream_status NOT NULL DEFAULT 'scheduled',
    scheduled_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    
    -- Metrics
    viewer_count INTEGER DEFAULT 0,
    peak_viewers INTEGER DEFAULT 0,
    total_gifts_received INTEGER DEFAULT 0,
    total_gift_value DECIMAL(18, 4) DEFAULT 0,
    
    -- Revenue
    creator_earnings DECIMAL(18, 4) DEFAULT 0,
    platform_earnings DECIMAL(18, 4) DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_stream_creator ON livestream_sessions(creator_wallet_id);
CREATE INDEX idx_stream_status ON livestream_sessions(status);
CREATE INDEX idx_stream_started ON livestream_sessions(started_at);

-- Down Migration
DROP TABLE IF EXISTS livestream_sessions;
DROP TYPE IF EXISTS stream_status;
