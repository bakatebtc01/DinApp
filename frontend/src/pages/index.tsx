import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
    return (
        <div className="min-h-screen bg-[#050505] text-gray-100 font-sans selection:bg-png-red/30">
            <Head>
                <title>DinApp | Digital Financial Marketplace</title>
                <meta name="description" content="The future of financial services in Papua New Guinea." />
            </Head>

            {/* Branding background effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-png-red/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-png-gold/5 blur-[120px] rounded-full" />
            </div>

            {/* Navigation */}
            <nav className="relative z-10 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto border-b border-white/5">
                <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="DinApp Logo" className="w-10 h-10 object-contain rounded-lg" />
                    <span className="text-2xl font-black tracking-tighter text-white uppercase">
                        DinApp
                    </span>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-gray-400">
                    <a href="#features" className="hover:text-png-red transition-colors">Platform</a>
                    <a href="#compliance" className="hover:text-png-red transition-colors">Vault</a>
                    <a href="#network" className="hover:text-png-red transition-colors">Agents</a>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
                        Sign In
                    </Link>
                    <Link href="/signup" className="bg-png-red text-white px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-png-gold hover:text-black transition-all duration-300 shadow-xl shadow-png-red/20">
                        Join Now
                    </Link>
                </div>
            </nav>

            <main className="relative z-10 px-6 pt-32 pb-40 max-w-7xl mx-auto text-center">
                {/* Hero Section */}
                <div className="max-w-4xl mx-auto mb-32">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-png-red/10 border border-png-red/20 text-png-red text-xs font-black tracking-widest uppercase mb-10">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-png-red opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-png-red"></span>
                        </span>
                        Pacific Nexus Network Active
                    </div>
                    <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-10 leading-[0.85] text-white">
                        DIGITAL <br />
                        <span className="text-png-gold">MARKETPLACE.</span>
                    </h1>
                    <p className="text-gray-400 text-xl md:text-2xl max-w-2xl mx-auto mb-16 leading-relaxed font-medium">
                        Phone-number-based wallets, QR payments, and creator monetization for PNG.
                        No banking risk, absolute transparency.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link href="/signup" className="w-full sm:w-auto px-12 py-5 bg-png-red text-white rounded-2xl font-black text-xl uppercase tracking-tighter hover:scale-105 transition-all shadow-2xl shadow-png-red/30">
                            Create Account
                        </Link>
                        <button className="w-full sm:w-auto px-12 py-5 bg-white/5 border border-white/10 rounded-2xl font-black text-xl uppercase tracking-tighter hover:bg-white/10 transition-colors">
                            Explore Assets
                        </button>
                    </div>
                </div>

                {/* Features Grid */}
                <div id="features" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                    {[
                        { title: 'Ledger Vault', desc: 'Immutable double-entry system for complete financial auditability.', icon: '⚖️' },
                        { title: 'QR Payments', desc: 'Universal scan-to-pay infrastructure for vendors and customers.', icon: '📱' },
                        { title: 'Creator Economy', desc: 'Direct monetization for content creators via gifts and subs.', icon: '💎' },
                        { title: 'Agent Network', desc: 'Secure cash-out points through licensed sub-agent infrastructure.', icon: '🏦' },
                        { title: 'Zero Exposure', desc: 'A platform architecture with no lending or balance-sheet risk.', icon: '🛡️' },
                        { title: 'E.164 Identity', desc: 'Secure phone-number-based access with OTP + PIN protection.', icon: '🆔' }
                    ].map((feature, i) => (
                        <div key={i} className="group p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:border-png-gold/30 transition-all duration-500 hover:bg-white/[0.05]">
                            <div className="text-5xl mb-8 group-hover:scale-110 transition-transform">{feature.icon}</div>
                            <h3 className="text-2xl font-black mb-4 text-white uppercase tracking-tight">{feature.title}</h3>
                            <p className="text-gray-400 leading-relaxed font-medium">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </main>

            <footer className="relative z-10 border-t border-white/5 bg-black py-20 px-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="flex items-center gap-3">
                        <img src="/logo.png" alt="DinApp logo small" className="w-8 h-8 object-contain opacity-50" />
                        <span className="font-black text-xl uppercase tracking-tighter text-gray-500">DinApp</span>
                    </div>
                    <p className="text-gray-600 text-sm font-bold uppercase tracking-widest">
                        &copy; {new Date().getFullYear()} Pacific Nexus Solutions
                    </p>
                    <div className="flex gap-10 text-xs font-black uppercase tracking-widest text-gray-500">
                        <a href="#" className="hover:text-png-red">Security</a>
                        <a href="#" className="hover:text-png-gold">Legal</a>
                        <a href="#" className="hover:text-white">Audit</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
