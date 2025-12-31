import React, { useState } from 'react';
import Head from 'next/head';
import CountryCodeSelect from '../components/CountryCodeSelect';

export default function Signup() {
    const [countryCode, setCountryCode] = useState('+675'); // Default to PNG
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ countryCode, phoneNumber }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(`Success! OTP sent. User ID: ${data.userId}`);
                // In a real app, redirect to OTP verification page
            } else {
                setMessage(`Error: ${data.error}`);
            }
        } catch (error) {
            setMessage('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-brand-dark flex flex-col items-center justify-center p-4">
            <Head>
                <title>Sign Up | DinApp</title>
                <meta name="description" content="Create your DinApp account" />
            </Head>

            <main className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
                <h1 className="text-3xl font-bold text-white text-center mb-2">
                    Create Account
                </h1>
                <p className="text-gray-300 text-center mb-8">
                    Enter your phone number to get started.
                </p>

                <form onSubmit={handleSignup} className="space-y-6">
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-200 mb-2">
                            Phone Number
                        </label>
                        <div className="flex">
                            <CountryCodeSelect value={countryCode} onChange={setCountryCode} />
                            <input
                                id="phone"
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                                placeholder="7XXXXXXX"
                                className="flex-1 px-4 py-2 border border-gray-300 border-l-0 rounded-r-md focus:outline-none focus:ring-2 focus:ring-brand-DEFAULT"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-DEFAULT hover:bg-brand-dark text-white font-semibold py-3 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Sending OTP...' : 'Sign Up'}
                    </button>
                </form>

                {message && (
                    <p className={`mt-4 text-center text-sm ${message.startsWith('Success') ? 'text-green-400' : 'text-red-400'}`}>
                        {message}
                    </p>
                )}

                <p className="mt-6 text-center text-gray-400 text-sm">
                    Already have an account?{' '}
                    <a href="/login" className="text-brand-light hover:underline">
                        Log In
                    </a>
                </p>
            </main>

            <footer className="mt-8 text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} Pacific Nexus Solutions
            </footer>
        </div>
    );
}
