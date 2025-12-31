-- Up Migration

-- 1. KYC Verifications Table
CREATE TYPE kyc_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE doc_type AS ENUM ('national_id', 'passport', 'drivers_license');

CREATE TABLE kyc_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    document_type doc_type NOT NULL,
    document_url TEXT NOT NULL,
    selfie_url TEXT,
    status kyc_status DEFAULT 'pending',
    rejection_reason TEXT,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Agent Profiles Table
CREATE TABLE agent_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    wallet_id UUID REFERENCES wallets(id),
    license_number VARCHAR(50) UNIQUE NOT NULL,
    region VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    sub_license_code VARCHAR(50), -- To trace hierarchy if needed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Risk Profiles & Limits
CREATE TABLE risk_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    daily_velocity_limit DECIMAL(18, 4) DEFAULT 1000.00, -- PGK
    monthly_velocity_limit DECIMAL(18, 4) DEFAULT 10000.00,
    current_daily_usage DECIMAL(18, 4) DEFAULT 0.00,
    last_reset_date DATE DEFAULT CURRENT_DATE,
    is_frozen BOOLEAN DEFAULT FALSE,
    risk_score INTEGER DEFAULT 0, -- 0-100
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Escrow Wallets (Adding to wallet_type enum isn't easy in some systems, but it's already there in migration 002)
-- Just adding a table for escrow metadata
CREATE TABLE escrow_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    escrow_wallet_id UUID REFERENCES wallets(id),
    source_wallet_id UUID REFERENCES wallets(id),
    destination_wallet_id UUID REFERENCES wallets(id),
    amount DECIMAL(18, 4) NOT NULL,
    status VARCHAR(20) DEFAULT 'locked', -- locked, released, refunded
    purpose VARCHAR(50), -- loan, trade, etc.
    reference_id UUID, -- Link to loan_id etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Down Migration
-- DROP TABLE IF EXISTS escrow_records;
-- DROP TABLE IF EXISTS risk_profiles;
-- DROP TABLE IF EXISTS agent_profiles;
-- DROP TABLE IF EXISTS kyc_verifications;
-- DROP TYPE IF EXISTS doc_type;
-- DROP TYPE IF EXISTS kyc_status;
