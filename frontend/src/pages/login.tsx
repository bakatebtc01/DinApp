import React, { useState } from "react";
import Head from "next/head";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Welcome back! You are now logged in.");
      } else {
        setMessage(`Error: ${data.error ?? "Login failed."}`);
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-brand-dark flex flex-col items-center justify-center p-4">
      <Head>
        <title>Log In | DinApp</title>
        <meta name="description" content="Log in to your DinApp account" />
      </Head>

      <main className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Welcome back
        </h1>
        <p className="text-gray-300 text-center mb-8">
          Sign in with your email and password to continue.
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-200 mb-2"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-DEFAULT"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-200 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-DEFAULT"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-DEFAULT hover:bg-brand-dark text-white font-semibold py-3 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Log In"}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center text-sm ${message.startsWith("Welcome") ? "text-green-400" : "text-red-400"}`}
          >
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-gray-400 text-sm">
          New to DinApp?{" "}
          <a href="/signup" className="text-brand-light hover:underline">
            Create an account
          </a>
        </p>
      </main>

      <footer className="mt-8 text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Pacific Nexus Solutions
      </footer>
    </div>
  );
}
