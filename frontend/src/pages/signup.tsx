import React, { useEffect, useState } from "react";
import Head from "next/head";
import CountryCodeSelect from "../components/CountryCodeSelect";

export default function Signup() {
  const [countryCode, setCountryCode] = useState("+675"); // Default to PNG
  const [phoneNumber, setPhoneNumber] = useState("");
  const [useAutoDetect, setUseAutoDetect] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [idType, setIdType] = useState("passport");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!useAutoDetect || typeof window === "undefined") {
      return;
    }

    const region = navigator.language.split("-")[1] || "PG";
    const regionToCode: Record<string, string> = {
      AU: "+61",
      NZ: "+64",
      PG: "+675",
      SG: "+65",
      US: "+1",
      GB: "+44",
    };

    setCountryCode(regionToCode[region] ?? "+675");
  }, [useAutoDetect]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            countryCode,
            phoneNumber,
            email,
            password,
            confirmPassword,
            firstName,
            surname,
            dateOfBirth,
            address,
            city,
            country,
            idType,
            pin,
            confirmPin,
          }),
        },
      );

      const data = await res.json();

      if (res.ok) {
        setMessage(`Success! OTP sent. User ID: ${data.userId}`);
        // In a real app, redirect to OTP verification page
      } else {
        setMessage(`Error: ${data.error}`);
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
        <title>Sign Up | DinApp</title>
        <meta name="description" content="Create your DinApp account" />
      </Head>

      <main className="w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Create Account
        </h1>
        <p className="text-gray-300 text-center mb-8">
          Sign up with your contact details, biodata, and ID verification to
          unlock your DinApp Digital Wallet.
        </p>

        <form onSubmit={handleSignup} className="space-y-6">
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-white">
              Contact details
            </h2>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-200 mb-2"
              >
                Mobile number
              </label>
              <div className="flex">
                <CountryCodeSelect
                  value={countryCode}
                  onChange={setCountryCode}
                />
                <input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) =>
                    setPhoneNumber(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="7XXXXXXX"
                  className="flex-1 px-4 py-2 border border-gray-300 border-l-0 rounded-r-md focus:outline-none focus:ring-2 focus:ring-brand-DEFAULT"
                  required
                />
              </div>
              <label className="mt-3 flex items-center gap-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={useAutoDetect}
                  onChange={(e) => setUseAutoDetect(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-brand-DEFAULT focus:ring-brand-DEFAULT"
                />
                Auto-detect country code from device location
              </label>
            </div>

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
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Password</h2>
            <div className="grid gap-4 md:grid-cols-2">
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
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-200 mb-2"
                >
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-DEFAULT"
                  required
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Bio data</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-200 mb-2"
                >
                  Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-DEFAULT"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="surname"
                  className="block text-sm font-medium text-gray-200 mb-2"
                >
                  Surname
                </label>
                <input
                  id="surname"
                  type="text"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-DEFAULT"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="block text-sm font-medium text-gray-200 mb-2"
                >
                  Date of birth
                </label>
                <input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-DEFAULT"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-200 mb-2"
                >
                  Country
                </label>
                <input
                  id="country"
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-DEFAULT"
                  required
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-200 mb-2"
              >
                Residential address
              </label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-DEFAULT"
                required
              />
            </div>
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-200 mb-2"
              >
                City
              </label>
              <input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-DEFAULT"
                required
              />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-white">
              Biometric security
            </h2>
            <p className="text-sm text-gray-300">
              Enable biometric fingerprint scan for faster login after sign up.
            </p>
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-brand-DEFAULT focus:ring-brand-DEFAULT"
                required
              />
              I will verify my fingerprint on this device.
            </label>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-white">
              Digital Wallet & ID verification
            </h2>
            <p className="text-sm text-gray-300">
              Choose your ID type to complete verification before creating your
              one-time wallet ID.
            </p>
            <div>
              <label
                htmlFor="idType"
                className="block text-sm font-medium text-gray-200 mb-2"
              >
                ID verification type
              </label>
              <select
                id="idType"
                value={idType}
                onChange={(e) => setIdType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-DEFAULT"
              >
                <option value="passport">Passport</option>
                <option value="national-id">National ID Card</option>
                <option value="drivers-licence">Driving Licence</option>
              </select>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-gray-200">
              Verification completes before a one-time Wallet ID is issued.
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-white">
              Payments PIN & features
            </h2>
            <p className="text-sm text-gray-300">
              Set a 4-digit PIN for P2P scan transfers and QR scan to pay.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="pin"
                  className="block text-sm font-medium text-gray-200 mb-2"
                >
                  4-digit PIN
                </label>
                <input
                  id="pin"
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-DEFAULT"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="confirmPin"
                  className="block text-sm font-medium text-gray-200 mb-2"
                >
                  Confirm PIN
                </label>
                <input
                  id="confirmPin"
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={confirmPin}
                  onChange={(e) =>
                    setConfirmPin(e.target.value.replace(/\D/g, ""))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-DEFAULT"
                  required
                />
              </div>
            </div>
            <ul className="list-disc space-y-2 pl-5 text-sm text-gray-300">
              <li>Withdraw to KINA Bank, BSP, or Westpac accounts.</li>
              <li>P2P scan transfers secured by your PIN.</li>
              <li>QR scan to pay with user-set PIN verification.</li>
            </ul>
          </section>

          <section className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold text-white">
              Transaction & revenue logic
            </h2>
            <p className="text-sm text-gray-300">
              DinApp (Gemini) is economic infrastructure for Papua New Guinea’s
              informal sector, enabling buai vendors and micro-entrepreneurs to
              display QR codes for instant digital payments.
            </p>
            <div className="space-y-3 text-sm text-gray-300">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Revenue & settlement model
                </h3>
                <ul className="list-disc space-y-1 pl-5">
                  <li>
                    Monthly service fee of K1.50 is deducted from wallet
                    balances.
                  </li>
                  <li>
                    Accumulated service fees are settled to the administrator’s
                    KINA Bank account.
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Liquidity & top-up protocols
                </h3>
                <ul className="list-disc space-y-1 pl-5">
                  <li>Top up at registered Gemini Agent locations.</li>
                  <li>
                    Deposits above K10,000 require direct processing with the
                    primary administrator for verification.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-DEFAULT hover:bg-brand-dark text-white font-semibold py-3 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending OTP..." : "Sign Up"}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center text-sm ${message.startsWith("Success") ? "text-green-400" : "text-red-400"}`}
          >
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-gray-400 text-sm">
          Already have an account?{" "}
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
