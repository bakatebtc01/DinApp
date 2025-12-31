import React from "react";
import Head from "next/head";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <Head>
        <title>DinApp - Pacific Nexus</title>
        <meta
          name="description"
          content="Digital Financial Marketplace Platform"
        />
      </Head>

      <main className="text-center p-8 bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-brand-DEFAULT mb-4">
          Welcome to DinApp
        </h1>
        <p className="text-gray-600 mb-8 text-lg">
          The Digital Financial Marketplace for Papua New Guinea.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div className="p-4 border rounded hover:border-brand-DEFAULT cursor-pointer transition">
            <h3 className="font-bold text-xl mb-2">Wallet & Ledger</h3>
            <p className="text-gray-500">
              Secure, double-entry accounting compliant with sandbox rules.
            </p>
          </div>
          <div className="p-4 border rounded hover:border-brand-DEFAULT cursor-pointer transition">
            <h3 className="font-bold text-xl mb-2">QR Payments</h3>
            <p className="text-gray-500">
              Scan-to-pay for merchants and vendors.
            </p>
          </div>
          <div className="p-4 border rounded hover:border-brand-DEFAULT cursor-pointer transition">
            <h3 className="font-bold text-xl mb-2">Live & Creators</h3>
            <p className="text-gray-500">
              Monetization for the creator economy.
            </p>
          </div>
          <div className="p-4 border rounded hover:border-brand-DEFAULT cursor-pointer transition">
            <h3 className="font-bold text-xl mb-2">Agent Payouts</h3>
            <p className="text-gray-500">Regulated cash-in/cash-out points.</p>
          </div>
        </div>
      </main>

      <footer className="mt-12 text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} Pacific Nexus Solutions
      </footer>
    </div>
  );
}
