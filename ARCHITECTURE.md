# DinApp "PNG Grade" Final System Architecture

This document replaces the previous architecture and defines the final unified DinApp model:

- Unlimited Shadow Pool rewards
- Biometric lending and anti-duplicate identity controls
- 10 daily ambassador task engine
- Full monthly payout lifecycle (15th batch)

## 1) Core Product Rules

| Feature | Final Rule |
|---|---|
| Membership | K150 one-time registration unlocks Ambassador status. |
| Shadow Pool | DinTokens (DT) are minted by backend task engine only, pegged 1:1 to Kina. |
| Ambassador Tasks | 10 daily share/invite tasks, payout K10.00 DT per verified referral. |
| Terence Tax | Flat K0.50 fee on each transfer/payment/withdrawal event. |
| Lending Loop | Instant loan issuance from admin interest pool, fixed 30% interest. |
| Snatch Engine | Auto-deduct principal + 30% within 1 second whenever funds enter debtor wallet. |
| Security | Biometric liveness + one-person-one-account controls. |
| Payouts | 15th of month bulk payout; users can withdraw 100% eligible earnings. |

## 2) High-Level Services

1. **Identity & Auth Service**
   - User registration, face biometric enrollment, liveness verification.
   - Duplicate detection using face hash + national identity metadata.
   - Session + RBAC controls for user/admin operations.

2. **Task & Referral Engine**
   - Tracks completion of up to 10 daily ambassador tasks.
   - Verifies referrals and mints K10 DT reward per successful verification.
   - Prevents self-referrals, multi-account abuse, and duplicate reward events.

3. **Shadow Ledger Service**
   - Maintains token ledger in DT (1:1 display as Kina).
   - Enforces immutable transaction entries (credit/debit/fee/loan).
   - Restricts minting rights to service roles only.

4. **Lending & Snatch Service**
   - Issues instant loans.
   - Applies fixed 30% interest.
   - Executes event-driven repayment sweep within 1 second of incoming funds.

5. **Wallet & Bank Settings Service**
   - Stores bank profile: bank name, account name, account number, BSB.
   - Handles `WITHDRAW FULL BALANCE` toggle for monthly payout inclusion.
   - Flags account if bank account name conflicts with verified biometric identity.

6. **Monthly Payout Orchestrator**
   - Runs on 15th and performs identity check, debt clearance, fee deductions.
   - Generates KATS-compatible payout CSV.
   - Separates user payout totals from admin profit totals.

7. **Admin Finance Service**
   - Tracks operator revenue from K0.50 fees and loan interest.
   - Posts operator profit to Terence wallet during monthly close.

## 3) Wallet UX Requirements

The Wallet tab must include **Bank Settings** with:

- Bank Name (`BSP`, `Kina`, `Westpac`, `ANZ`)
- Account Name
- Account Number
- BSB
- `WITHDRAW FULL BALANCE` toggle

### Withdrawal Logic

If `WITHDRAW FULL BALANCE = ON`, monthly batch logic adds:

`eligible_balance = shadow_balance - outstanding_loan_total - monthly_withdrawal_tax`

Where monthly withdrawal tax includes at minimum the K0.50 withdrawal fee.

## 4) Canonical 15th-Day Batch Flow

The payout script must run in this order:

1. **Identity Check**
   - Validate biometric profile status and duplicate risk flags.
2. **Debt Clearance**
   - Deduct loan principal + 30% interest from shadow balances.
3. **Tax Deduction**
   - Apply K0.50 transaction/withdrawal fee policy.
4. **CSV Generation**
   - Export bank-ingestion CSV (KATS-compliant).
5. **Admin Interest Settlement**
   - Calculate all collected fees + loan interest and credit Terence wallet.

## 5) Face Mismatch Handling Policy

When face data does not match bank account name:

1. **Auto-flag account**: set status to `UNDER_REVIEW`.
2. **Freeze bank updates**: disable payout edits until review completes.
3. **Soft hold on payout**: do not include user in 15th CSV while unresolved.
4. **Manual review queue**: admin can request ID proof and selfie retry.
5. **Decision outcomes**:
   - `APPROVED`: unlock payouts and bank settings.
   - `REJECTED`: keep frozen and require full re-verification or account closure.
6. **Audit logging**: every mismatch check and admin action is immutable.

## 6) Security & Data Integrity

- PostgreSQL Row-Level Security (RLS) protects all user-owned records.
- Only service roles can create reward-mint and system-settlement entries.
- Strict ledger immutability: no update/delete on posted financial entries.
- Biometric templates stored encrypted at rest.
- All sensitive operations produce signed audit trail events.

## 7) Deployment Strategy

1. Register business entity (IPA certificate).
2. Deploy backend on AWS/DigitalOcean with managed PostgreSQL.
3. Enable encrypted backups and key management.
4. Roll out referral campaign (Facebook + WhatsApp channels).

## 8) Build Sequence (Recommended)

1. **Database migration first** (schema, constraints, RLS, ledger primitives).
2. Task engine and lending/snatch workers.
3. Wallet UI and biometric onboarding interface.
4. Monthly payout command + CSV integration testing.
5. Admin review and fraud tooling.
