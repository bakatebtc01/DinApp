-- Up Migration

CREATE TYPE user_kyc_status AS ENUM ('PENDING', 'VERIFIED', 'UNDER_REVIEW', 'REJECTED');
CREATE TYPE bank_name AS ENUM ('BSP', 'Kina', 'Westpac', 'ANZ');
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
CREATE TYPE loan_status AS ENUM ('ACTIVE', 'SETTLED', 'DEFAULTED');
CREATE TYPE review_decision AS ENUM ('APPROVED', 'REJECTED', 'REQUEST_RETRY');

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

-- Enable RLS on sensitive user-owned tables
ALTER TABLE biometric_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ambassador_daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE shadow_ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE identity_mismatch_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_payout_items ENABLE ROW LEVEL SECURITY;

-- Minimal owner-only policies (replace app.current_user_id() with your auth function)
CREATE POLICY biometric_profiles_user_select ON biometric_profiles
  FOR SELECT USING (user_id = app.current_user_id());

CREATE POLICY bank_settings_user_select ON bank_settings
  FOR SELECT USING (user_id = app.current_user_id());

CREATE POLICY ambassador_tasks_user_select ON ambassador_daily_tasks
  FOR SELECT USING (user_id = app.current_user_id());

CREATE POLICY ledger_entries_user_select ON shadow_ledger_entries
  FOR SELECT USING (user_id = app.current_user_id());

CREATE POLICY loans_user_select ON loans
  FOR SELECT USING (user_id = app.current_user_id());

CREATE POLICY payout_items_user_select ON monthly_payout_items
  FOR SELECT USING (user_id = app.current_user_id());

-- Down Migration
DROP TABLE IF EXISTS monthly_payout_items;
DROP TABLE IF EXISTS monthly_payout_batches;
DROP TABLE IF EXISTS identity_mismatch_reviews;
DROP TABLE IF EXISTS snatch_events;
DROP TABLE IF EXISTS loans;
DROP TABLE IF EXISTS shadow_ledger_entries;
DROP TABLE IF EXISTS ambassador_daily_tasks;
DROP TABLE IF EXISTS bank_settings;
DROP TABLE IF EXISTS biometric_profiles;

DROP TYPE IF EXISTS review_decision;
DROP TYPE IF EXISTS loan_status;
DROP TYPE IF EXISTS ledger_entry_type;
DROP TYPE IF EXISTS bank_name;
DROP TYPE IF EXISTS user_kyc_status;
