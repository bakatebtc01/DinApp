import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Terms & Conditions | DinApp</title>
      </Head>
      
      <div className="max-w-4xl mx-auto bg-white p-8 shadow rounded-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms and Conditions</h1>
        
        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">1. General Platform Terms</h2>
            <p>By registering, accessing, or using DinApp, you agree to be bound by these Terms & Conditions. If you do not agree, you must not use the platform.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">2. Wallet & Payments Terms</h2>
            
            <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">2.4 Subscription, Settlement & Liquidity Protocols</h3>
            <p>To support sandbox testing requirements and KYC oversight in Papua New Guinea:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>A monthly service subscription fee of <strong>K1.50</strong> is automatically deducted from each user wallet balance.</li>
              <li>Accumulated service fees are settled to the administrator’s designated <strong>KINA Bank</strong> account.</li>
              <li>Wallet top-ups are available at registered DinApp/Gemini Agent locations.</li>
              <li>Deposits above <strong>K10,000</strong> must be processed directly with the primary administrator for enhanced verification.</li>
            </ul>

            <h3 className="text-lg font-medium text-gray-900 mt-6 mb-2">2.5 User Permissions & Feature Set</h3>
            <p>To enable a seamless transaction experience, users authorize the following:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Push Notifications:</strong> Instant pop-up alerts for account activity.</li>
              <li><strong>SMS Integration:</strong> Verification and offline transaction confirmations.</li>
              <li><strong>Audio Announcements:</strong> “Money Received” voice alerts that announce sender name and amount.</li>
            </ul>
            
            <p className="mt-4">Additional transaction and utility features include:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>PDF Statements:</strong> Exportable, branded PDF transaction history.</li>
              <li><strong>Virtual Currency Conversion:</strong> Wallet balance can be used to purchase virtual gifts.</li>
              <li><strong>Livestream Gifting:</strong> Real-time gifting to creators during livestreams.</li>
            </ul>

            <h4 className="font-medium text-gray-900 mt-4 mb-2">Feature summary</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feature</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specification</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">Notification Type</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">Audio + Pop-up (includes sender name)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">Reporting</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">Exportable PDF history</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">Utility</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">Livestream gifting / virtual goods</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">Distributor</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">Pacific Nexus Solutions Limited</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">IP Holder</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">Baka Te Inc.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">3. Livestreaming, Gifting & Subscriptions Terms</h2>
            <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">Revenue Split (Gifting & Subscriptions)</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>50%</strong> to Creator</li>
              <li><strong>50%</strong> to DinApp (Baka Te Inc. as IP holder via Pacific Nexus Solutions Ltd.)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">4. Borrowing & Lending Marketplace Terms</h2>
            <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">4.1 Platform Role</h3>
            <p>DinApp does not lend money, set interest rates, or guarantee repayment. DinApp only provides marketplace access, escrow, and system enforcement.</p>
            
            <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">4.2 Borrowers</h3>
            <p>Borrowers use the platform free of charge and choose offers at their own discretion. Failure to repay may result in account restriction, loss of platform access, and reporting within legal limits.</p>
            
            <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">4.3 Lenders</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Lenders earn interest at self-set rates.</li>
              <li><strong>Lenders pay 10% monthly platform fee on interest earned only.</strong></li>
              <li>Principal amounts are never charged fees.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">5. Agent & Cash-Out Terms</h2>
            <p>Agents are independent operators acting under DinApp sub-license. Cash-outs require OTP + PIN confirmation and are final once completed.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">6. KYC, AML & Compliance Terms</h2>
            <p>Users must provide accurate identification and undergo verification. DinApp monitors transactions for fraud, money laundering, and abuse. Failure to comply may result in account limits or termination.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">7. Prohibited Conduct & Enforcement</h2>
            <p>Users must not use fake identities, abuse gifting, manipulate transactions, or launder money. Enforcement actions include warnings, temporary restrictions, wallet freezes, and permanent bans.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">8. Limitation of Liability & Disclaimers</h2>
            <p>DinApp is provided "as-is". Users acknowledge that digital transactions carry risk and earnings are not guaranteed. DinApp is not liable for user losses or third-party actions.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">9. Legal Framework & Authorization</h2>
            <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">9.1 Patent Ownership</h3>
            <p>The Gemini App and its underlying economic infrastructure are the intellectual property of <strong>Baka Te Inc.</strong>, a community-based charity organization.</p>
            
            <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">9.2 Authorized Distribution</h3>
            <p><strong>Pacific Nexus Solutions Limited</strong> is the officially designated <strong>Gold Distributor</strong>, holding exclusive distribution rights and responsible for regional deployment and management of the platform.</p>
            
            <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">9.3 Integration Summary</h3>
            <div className="overflow-x-auto mt-2">
              <table className="min-w-full divide-y divide-gray-200 border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Financial Destination</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">Baka Te Inc.</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">Patent Owner (Charity/Community Focus)</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">IP Holder</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">Pacific Nexus Solutions Ltd.</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">Authorized Gold Distributor</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">Operational Management</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">Kina Bank Account</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">Settlement Point</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">Monthly Fees (K1.50/user)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">10. Compliance, KYC & AML Obligations</h2>
            <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">10.1 Know Your Customer (KYC)</h3>
            <p>All users must complete identity verification as required under Papua New Guinea regulatory sandbox guidelines. DinApp may require valid government-issued identification, proof of phone number ownership, and additional verification for high-value transactions.</p>
            
            <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">10.2 Anti-Money Laundering (AML) & Counter-Terrorism Financing (CTF)</h3>
            <p>DinApp complies with applicable AML/CTF principles and reserves the right to monitor transactions, freeze wallets pending review, and report transactions where legally required.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">11. Data Privacy & Information Security</h2>
            <p>DinApp collects only data necessary to operate services and comply with legal requirements. User data is stored securely, and DinApp does not sell user data to third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">12. Account Suspension & Termination</h2>
            <p>DinApp may suspend or restrict accounts for fraud, KYC non-compliance, or term violations. Accounts may be permanently terminated for serious breaches.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">13. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, DinApp is not liable for indirect losses. Liability is limited to platform functionality, not user decisions.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">14. Dispute Resolution</h2>
            <p>Users agree to first attempt resolution through DinApp’s internal support channels. Unresolved disputes fall under the jurisdiction of Papua New Guinea courts.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">15. Contact & Official Communication</h2>
            <p>Official communications are issued by Pacific Nexus Solutions Limited (Platform Operator), Baka Te Inc. (IP Owner), and KINA Bank (Settlement Partner). Support inquiries must be made through officially published DinApp channels.</p>
          </section>

          <div className="pt-6 border-t border-gray-200">
            <Link href="/signup" className="text-indigo-600 hover:text-indigo-500 font-medium">
              &larr; Back to Signup
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
