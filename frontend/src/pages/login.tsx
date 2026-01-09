import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import CountryCodeSelect from '../components/CountryCodeSelect';

export default function Login() {
    const router = useRouter();
    const [countryCode, setCountryCode] = useState('+675');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // 1: Credentials, 2: OTP
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLoginStep1 = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ countryCode, phoneNumber, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setStep(2);
            } else {
                setError(data.error || 'Identity verification failed');
            }
        } catch (err) {
            setError('Network connection error. Ensure API is online.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber, otp }),
            });

            if (res.ok) {
                if (phoneNumber === '73067659') {
                    router.push('/admin/dashboard');
                } else {
                    setError('Access restricted to Admin in this sandbox environment.');
                }
            } else {
                setError('Invalid Secure Token (OTP)');
            }
        } catch (err) {
            setError('Verification failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-gray-100 flex flex-col items-center justify-center p-4">
            <Head>
                <title>Access Vault | DinApp</title>
            </Head>

            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] left-[30%] w-[40%] h-[40%] bg-png-red/5 blur-[100px] rounded-full" />
            </div>

            <main className="relative z-10 w-full max-w-md">
                <div className="text-center mb-12">
                    <Link href="/" className="inline-flex items-center gap-3 mb-10 group">
                        <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain" />
                        <span className="text-4xl font-black tracking-tighter text-white uppercase">DinApp</span>
                    </Link>
                    <h1 className="text-4xl font-black uppercase tracking-tight mb-3">
                        {step === 1 ? 'Marketplace Login' : 'Secure Verification'}
                    </h1>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
                        {step === 1 ? 'Enter phone & password' : 'Enter 6-digit secure token'}
                    </p>
                </div>

                <div className="bg-white/[0.03] border border-white/5 backdrop-blur-3xl rounded-[2.5rem] p-10 shadow-2xl">
                    {step === 1 ? (
                        <form onSubmit={handleLoginStep1} className="space-y-8">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Phone Identity</label>
                                <div className="flex">
                                    <CountryCodeSelect value={countryCode} onChange={setCountryCode} />
                                    <input
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                                        placeholder="7XXXXXXX"
                                        className="flex-1 bg-white/5 border border-white/10 border-l-0 rounded-r-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-png-red/50 transition-all font-mono text-lg"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Access Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-png-red/50 transition-all text-lg"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="p-5 bg-png-red/10 border border-png-red/20 rounded-2xl text-png-red text-sm font-bold uppercase tracking-tight">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-png-red text-white py-5 rounded-2xl font-black uppercase tracking-widest text-lg hover:bg-png-gold hover:text-black transition-all duration-300 disabled:opacity-50 shadow-2xl shadow-png-red/20"
                            >
                                {loading ? 'Authorizing...' : 'Authorize'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-8">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Secure Token (OTP)</label>
                                <input
                                    type="text"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                    placeholder="000000"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-6 text-center text-4xl font-black tracking-[1rem] focus:outline-none focus:ring-2 focus:ring-png-gold/50 transition-all"
                                    required
                                    autoFocus
                                />
                            </div>

                            {error && (
                                <div className="p-5 bg-png-red/10 border border-png-red/20 rounded-2xl text-png-red text-sm font-bold uppercase tracking-tight">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-png-gold text-black py-5 rounded-2xl font-black uppercase tracking-widest text-lg hover:bg-white transition-all duration-300 disabled:opacity-50 shadow-2xl shadow-png-gold/10"
                            >
                                {loading ? 'Verifying...' : 'Verify & Access'}
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-full text-xs font-bold uppercase tracking-widest text-gray-600 hover:text-white transition-colors"
                            >
                                Use different credentials
                            </button>
                        </form>
                    )}
                </div>

                {/* Sandbox Information */}
                <div className="mt-12 p-6 bg-png-gold/5 border border-png-gold/10 rounded-[1.5rem] text-center">
                    <p className="text-[10px] text-png-gold font-bold uppercase tracking-[0.2em] leading-relaxed">
                        Developer Access Protocol: Use OTP <span className="text-white bg-png-gold/20 px-1 rounded">030323</span> for sandbox verification.
                    </p>
                </div>
            </main>
        </div>
    );
}
