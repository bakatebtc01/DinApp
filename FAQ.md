# DINAPP – FREQUENTLY ASKED QUESTIONS (FAQ)

## 1. What exactly is DinApp?
DinApp is a digital financial marketplace platform that provides wallets, QR payments, creator monetization (gifts + subscriptions), a blind-bidding borrow/lend marketplace, and agent-based cash-out. It provides infrastructure, not banking services.

## 2. Is DinApp a bank?
**No.** DinApp is not a bank, does not accept deposits, and does not intermediate credit risk. Wallet balances are transactional and time-bound.

## 3. Does DinApp lend money?
**No.** DinApp does not lend and does not set interest rates. Borrowing and lending occurs between users via a blind-bidding marketplace with escrow and enforcement logic.

## 4. How does DinApp make money?
From platform usage, not balance-sheet risk:
- **Livestream gifts:** 45% platform / 55% creator
- **Monthly subscriptions (3 tiers):** 45% platform / 55% creator
- **Borrow/Lend:** Lenders pay 10% monthly on interest earned only
- **Transaction fees:** Small, transparent, usage-based

## 5. Why the 55% / 45% split?
It’s:
- Simple and transparent
- Competitive for creators
- Easy to audit
- Stable across gifts and subscriptions

## 6. How are users identified?
Phone number = account, with:
- Country code (E.164)
- OTP verification
- PIN
- Device binding

This minimizes friction while maintaining control.

## 7. How does DinApp prevent fraud?
Through prevention-first controls:
- OTP + PIN for all value actions
- Velocity and circular-flow detection
- Self-gifting and subscription abuse detection
- Wallet freezes and audit trails
- Controlled agent payouts

## 8. How does QR Scan-to-Pay work in informal markets?
1. Merchant generates QR
2. User scans → OTP + PIN
3. Digital receipt + optional print
4. Audible confirmation (“Payment confirmed. User [Name] verified.”)

This prevents screenshot fraud and disputes in cash-heavy settings.

## 9. Who can cash out without a bank account?
Users can withdraw via:
- Bank of Papua New Guinea–accredited agents
- DinApp sub-licensed agents

*OTP + PIN + KYC tier checks are mandatory.*

## 10. What KYC is required?
Tiered KYC:
- **Tier 0:** Phone + OTP (view/low limits)
- **Tier 1:** ID + selfie (earnings allowed, limited)
- **Tier 2:** Enhanced KYC (higher limits, withdrawals)

*Withdrawals require adequate KYC.*

## 11. How is AML/CFT handled?
- Transaction monitoring (velocity, structuring)
- Circular transaction detection
- Wallet freezes when required
- Exportable audit logs
- Regulator-ready reporting

## 12. Can borrowers and lenders contact each other?
**No.** Direct messaging is disabled to prevent harassment, coercion, and collusion. All interactions are system-mediated.

## 13. What happens if a borrower defaults?
- Platform enforcement (account limits, access restrictions)
- No physical enforcement
- DinApp does not guarantee repayment

## 14. Are subscriptions refundable?
Subscriptions are monthly digital services. Users can cancel anytime; no partial refunds for used periods.

## 15. How scalable is the technology?
- Microservices with strict isolation
- Immutable double-entry ledger
- Kubernetes-ready
- Cloud-agnostic
- Built for regional expansion without re-architecture

## 16. What regulatory status is DinApp seeking?
DinApp enters via a sandbox, then pursues modular licensing only if required (e.g., payment facilitation). It will not pursue a banking license.

## 17. What risks does DinApp avoid by design?
- No deposit liabilities
- No lending capital exposure
- No interest spread risk
- No FX speculation

*This keeps systemic risk low.*

## 18. How does DinApp protect consumer funds?
- Segregated wallets (user, agent float, platform revenue)
- Escrow for lending
- Immutable ledger
- No manual balance changes
- Auditable agent payouts

## 19. What is the exit strategy for investors?
- Scale users and transactions
- Expand regionally with local regulatory wrappers
- Valuation driven by EBITDA and network effects, not balance-sheet leverage

## 20. Why will users stick with DinApp?
Because it combines:
- Payments
- Earnings
- Subscriptions
- Lending access
- Cash-out via agents

*All under one identity and wallet → high switching costs.*
