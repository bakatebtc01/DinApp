-- Up Migration

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE SCHEMA IF NOT EXISTS app;

CREATE OR REPLACE FUNCTION app.current_user_id()
RETURNS UUID
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  user_id_setting TEXT;
BEGIN
  user_id_setting := current_setting('app.current_user_id', true);
  IF user_id_setting IS NULL OR user_id_setting = '' THEN
    RETURN NULL;
  END IF;

  RETURN user_id_setting::UUID;
EXCEPTION
  WHEN invalid_text_representation THEN
    RETURN NULL;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_kyc_status') THEN
    CREATE TYPE user_kyc_status AS ENUM ('PENDING', 'VERIFIED', 'UNDER_REVIEW', 'REJECTED');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'bank_name') THEN
    CREATE TYPE bank_name AS ENUM ('BSP', 'Kina', 'Westpac', 'ANZ');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ledger_entry_type') THEN
    CREATE TYPE ledger_entry_type AS ENUM (
      'MEMBERSHIP_FEE',
      'TASK_REWARD',
      'REFERRAL_REWARD',
      'TRANSFER',
      'SCAN_PAY',
      'TRANSACTION_FEE',
      'LOAN_DISBURSEMENT',
      'LOAN_REPAYMENT',
      'LOAN_INTEREST',
      'WITHDRAWAL',
      'SYSTEM_ADJUSTMENT',
      'ADMIN_PROFIT_SETTLEMENT'
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'loan_status') THEN
    CREATE TYPE loan_status AS ENUM ('ACTIVE', 'SETTLED', 'DEFAULTED');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'review_decision') THEN
    CREATE TYPE review_decision AS ENUM ('APPROVED', 'REJECTED', 'REQUEST_RETRY');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS biometric_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  encrypted_face_template BYTEA NOT NULL,
  face_hash TEXT NOT NULL UNIQUE,
  liveness_score NUMERIC(5,2) NOT NULL,
  kyc_status user_kyc_status NOT NULL DEFAULT 'PENDING',
  duplicate_risk_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bank_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  bank_name bank_name NOT NULL,
  account_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  bsb TEXT NOT NULL,
  withdraw_full_balance BOOLEAN NOT NULL DEFAULT FALSE,
  is_locked BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ambassador_daily_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_date DATE NOT NULL,
  completed_tasks INTEGER NOT NULL DEFAULT 0 CHECK (completed_tasks BETWEEN 0 AND 10),
  verified_referrals INTEGER NOT NULL DEFAULT 0,
  reward_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, task_date)
);

CREATE TABLE IF NOT EXISTS shadow_ledger_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  entry_type ledger_entry_type NOT NULL,
  amount NUMERIC(14,2) NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('CREDIT', 'DEBIT')),
  currency TEXT NOT NULL DEFAULT 'DT',
  reference_id TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shadow_ledger_user_created_at
ON shadow_ledger_entries (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  principal_amount NUMERIC(14,2) NOT NULL,
  interest_rate NUMERIC(5,2) NOT NULL DEFAULT 30.00,
  total_due NUMERIC(14,2) GENERATED ALWAYS AS (principal_amount * (1 + (interest_rate / 100))) STORED,
  remaining_due NUMERIC(14,2) NOT NULL,
  status loan_status NOT NULL DEFAULT 'ACTIVE',
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  settled_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_loans_user_status
ON loans (user_id, status);

CREATE TABLE IF NOT EXISTS snatch_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_id UUID NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  incoming_entry_id UUID NOT NULL REFERENCES shadow_ledger_entries(id) ON DELETE RESTRICT,
  deducted_amount NUMERIC(14,2) NOT NULL,
  executed_in_ms INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS identity_mismatch_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  biometric_profile_id UUID NOT NULL REFERENCES biometric_profiles(id) ON DELETE CASCADE,
  bank_settings_id UUID NOT NULL REFERENCES bank_settings(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  decision review_decision,
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS monthly_payout_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payout_month DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING',
  csv_file_path TEXT,
  total_user_payout NUMERIC(14,2) NOT NULL DEFAULT 0,
  total_admin_profit NUMERIC(14,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  UNIQUE (payout_month)
);

CREATE TABLE IF NOT EXISTS monthly_payout_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID NOT NULL REFERENCES monthly_payout_batches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  gross_earnings NUMERIC(14,2) NOT NULL DEFAULT 0,
  debt_deduction NUMERIC(14,2) NOT NULL DEFAULT 0,
  tax_deduction NUMERIC(14,2) NOT NULL DEFAULT 0,
  net_payout NUMERIC(14,2) NOT NULL DEFAULT 0,
  is_held BOOLEAN NOT NULL DEFAULT FALSE,
  hold_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (batch_id, user_id)
);

ALTER TABLE biometric_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ambassador_daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE shadow_ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE identity_mismatch_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_payout_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS biometric_profiles_user_select ON biometric_profiles;
CREATE POLICY biometric_profiles_user_select ON biometric_profiles
  FOR SELECT USING (user_id = app.current_user_id());

DROP POLICY IF EXISTS bank_settings_user_select ON bank_settings;
CREATE POLICY bank_settings_user_select ON bank_settings
  FOR SELECT USING (user_id = app.current_user_id());

DROP POLICY IF EXISTS ambassador_tasks_user_select ON ambassador_daily_tasks;
CREATE POLICY ambassador_tasks_user_select ON ambassador_daily_tasks
  FOR SELECT USING (user_id = app.current_user_id());

DROP POLICY IF EXISTS ledger_entries_user_select ON shadow_ledger_entries;
CREATE POLICY ledger_entries_user_select ON shadow_ledger_entries
  FOR SELECT USING (user_id = app.current_user_id());

DROP POLICY IF EXISTS loans_user_select ON loans;
CREATE POLICY loans_user_select ON loans
  FOR SELECT USING (user_id = app.current_user_id());

DROP POLICY IF EXISTS payout_items_user_select ON monthly_payout_items;
CREATE POLICY payout_items_user_select ON monthly_payout_items
  FOR SELECT USING (user_id = app.current_user_id());

-- Down Migration
DROP POLICY IF EXISTS payout_items_user_select ON monthly_payout_items;
DROP POLICY IF EXISTS loans_user_select ON loans;
DROP POLICY IF EXISTS ledger_entries_user_select ON shadow_ledger_entries;
DROP POLICY IF EXISTS ambassador_tasks_user_select ON ambassador_daily_tasks;
DROP POLICY IF EXISTS bank_settings_user_select ON bank_settings;
DROP POLICY IF EXISTS biometric_profiles_user_select ON biometric_profiles;

DROP TABLE IF EXISTS monthly_payout_items;
DROP TABLE IF EXISTS monthly_payout_batches;
DROP TABLE IF EXISTS identity_mismatch_reviews;
DROP TABLE IF EXISTS snatch_events;
DROP TABLE IF EXISTS loans;
DROP TABLE IF EXISTS shadow_ledger_entries;
DROP TABLE IF EXISTS ambassador_daily_tasks;
DROP TABLE IF EXISTS bank_settings;
DROP TABLE IF EXISTS biometric_profiles;

DROP FUNCTION IF EXISTS app.current_user_id();
DROP TYPE IF EXISTS review_decision;
DROP TYPE IF EXISTS loan_status;
DROP TYPE IF EXISTS ledger_entry_type;
DROP TYPE IF EXISTS bank_name;
DROP TYPE IF EXISTS user_kyc_status;
