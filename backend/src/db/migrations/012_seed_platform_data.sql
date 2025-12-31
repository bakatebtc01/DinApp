-- Up Migration

-- 1. Create Platform Admin User
INSERT INTO users (id, phone_country_code, phone_number, is_verified, kyc_tier)
VALUES ('00000000-0000-0000-0000-000000000000', '+000', '000000000', TRUE, 2)
ON CONFLICT DO NOTHING;

-- 2. Create Platform & System Wallets
INSERT INTO wallets (user_id, wallet_type, currency, balance, status)
VALUES 
    ('00000000-0000-0000-0000-000000000000', 'platform', 'PGK', 1000000.00, 'active'),
    ('00000000-0000-0000-0000-000000000000', 'escrow', 'PGK', 0.00, 'active')
ON CONFLICT (user_id, wallet_type) DO NOTHING;

-- Down Migration
-- DELETE FROM wallets WHERE user_id = '00000000-0000-0000-0000-000000000000';
-- DELETE FROM users WHERE id = '00000000-0000-0000-0000-000000000000';
