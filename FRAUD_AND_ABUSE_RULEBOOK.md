# DINAPP – FRAUD & ABUSE RULEBOOK
**Version:** 1.0 (Sandbox-Grade Controls)

## 1. OBJECTIVE
This rulebook defines how DinApp:
- Detects fraud
- Prevents abuse
- Protects users
- Preserves platform integrity
- Meets AML/CFT expectations

**Principle:** Prevention first, detection second, enforcement always.

---

## 2. CORE PRINCIPLES
1. **No anonymous money movement**
2. **No unchecked velocity**
3. **No private enforcement**
4. **No off-platform coercion**
5. **No manual balance manipulation**
6. **Everything is logged**

---

## 3. IDENTITY & ACCOUNT ABUSE CONTROLS
### 3.1 One Human, One Wallet
**Rules:**
- One phone number = one account.
- Device fingerprinting enforced.
- SIM-swap risk scoring.
- Duplicate device clustering detection.

**Triggers:**
- Same device → multiple phone numbers.
- Rapid re-registration attempts.
- Frequent OTP failures.

**Action:**
- Step-up verification.
- Temporary wallet freeze.
- Manual review.

---

## 4. OTP & AUTHENTICATION ABUSE
### 4.1 OTP Brute Force
**Detection:**
- >5 OTP attempts per window.
- Repeated expired OTP use.

**Action:**
- Rate limiting.
- Temporary account lock.
- Device-level cooldown.

---

## 5. WALLET & TRANSACTION FRAUD
### 5.1 Velocity Abuse
**Detection:**
- Sudden spikes in transaction count.
- Micro-transaction flooding.
- Structuring below limits (smurfing).

**Action:**
- Transaction throttling.
- Wallet freeze.
- AML flag.

### 5.2 Circular Money Flow
**Detection:**
- Funds cycling between same wallets.
- Gift → withdraw → re-gift loops.
- Subscription churn abuse.

**Action:**
- Earnings hold.
- Revenue clawback (where permitted).
- Account downgrade or suspension.

---

## 6. LIVESTREAMING, GIFTS & SUBSCRIPTIONS ABUSE
### 6.1 Fake Gifting / Self-Gifting
**Detection:**
- Same IP/device gifting same creator.
- Family or linked accounts gifting repeatedly.
- Gift-to-withdraw cycles.

**Action:**
- Earnings delay.
- Gift reversal (sandbox only).
- Creator warning or ban.

### 6.2 Subscription Fraud
**Detection:**
- Rapid subscribe/cancel patterns.
- Self-funded subscriptions.
- Subscription rings.

**Action:**
- Subscription cancellation.
- Revenue hold.
- Tier downgrade.

---

## 7. BORROW & LEND ABUSE (HIGH RISK ZONE)
### 7.1 Harassment & Coercion
**Rules:**
- No borrower–lender direct messaging.
- No physical enforcement.
- No threats.

**Detection:**
- External reports.
- Pattern-based lender behavior.
- Repeated aggressive collections.

**Action:**
- Immediate lender suspension.
- Funds locked.
- Permanent ban for severe cases.

### 7.2 Interest Abuse
**Detection:**
- Excessive interest bids.
- Repeat exploitation patterns.

**Action:**
- Interest caps applied (sandbox).
- Lender review.
- Offer removal.

---

## 8. AGENT & CASH-OUT FRAUD
### 8.1 Agent Collusion
**Detection:**
- Agent-only transaction loops.
- Excessive cash-outs.
- Float anomalies.

**Action:**
- Agent wallet freeze.
- On-site audit.
- License revocation.

### 8.2 Fake Payout Claims
**Detection:**
- OTP mismatch.
- Duplicate payout attempts.
- Screenshot-based claims.

**Action:**
- Denial.
- Transaction replay audit.
- User warning.

---

## 9. BLACK-MARKET / INFORMAL VENDOR ABUSE
### 9.1 Screenshot Fraud
**Prevention:**
- OTP + PIN mandatory.
- Audio confirmation on success.
- Printed or QR-verifiable receipts.

**Detection:**
- Disputed payments.
- Missing ledger confirmation.

**Action:**
- Transaction lookup.
- Vendor strike system.

---

## 10. AML / CFT RED FLAGS
### 10.1 High-Risk Indicators
- Rapid in/out funds.
- Cross-account structuring.
- Unusual geographic patterns.
- High-value gifting with no engagement.

### 10.2 Actions
- Wallet freeze.
- Enhanced KYC request.
- Regulatory report preparation (if required).

---

## 11. ENFORCEMENT ACTION MATRIX
| Severity | Action |
| :--- | :--- |
| **Low** | Warning + education |
| **Medium** | Temporary freeze |
| **High** | Earnings hold + investigation |
| **Critical** | Permanent ban + regulator notice |

*No enforcement is manual-only. All actions require system logs + admin approval.*

---

## 12. USER & CREATOR PROTECTIONS
- Clear fee disclosures.
- Cancellation rights (subscriptions).
- Dispute escalation path.
- No surprise deductions.
- Transparent earnings history.

---

## 13. AUDIT & REPORTING
- All fraud events logged.
- Immutable audit trails.
- Exportable reports for regulators.
- Agent activity fully traceable.
- Sandbox review support ready.

---

## 14. SANDBOX COMMITMENT
During sandbox testing, DinApp commits to:
- Conservative thresholds.
- Faster intervention.
- Manual overrides under regulator instruction.
- Transparent incident reporting.

---

## FINAL STATEMENT
DinApp’s fraud and abuse framework is preventive, proportionate, and enforceable. It protects users, supports financial inclusion, and provides regulators with full visibility and control without stifling innovation.
