-- Up Migration
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_country_code VARCHAR(5) NOT NULL, -- E.g. +675
    phone_number VARCHAR(20) NOT NULL, -- E.164 format
    pin_hash VARCHAR(255), -- Bcrypt hash of 6-digit PIN
    kyc_tier INTEGER DEFAULT 0, -- 0=Entry, 1=Basic, 2=Full
    is_verified BOOLEAN DEFAULT FALSE, -- OTP Verification status
    device_id VARCHAR(255), -- For device binding/fingerprinting
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT uq_phone UNIQUE (phone_country_code, phone_number)
);

-- Down Migration
DROP TABLE IF EXISTS users;
