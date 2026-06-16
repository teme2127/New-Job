// app/signup/page.js
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "candidate" });
  const [submitState, setSubmitState] = useState({ loading: false, error: "", success: false });
  const [verificationSent, setVerificationSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitState({ loading: true, error: "", success: false });

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setSubmitState({ loading: false, error: "", success: false });

      if (res.ok) {
        setSubmitState({ loading: false, error: "", success: true });
        // Send verification email
        fetch(`/api/auth/send-verification?email=${encodeURIComponent(formData.email)}`)
          .then(() => setVerificationSent(true))
          .catch(() => console.error('Failed to send verification email'));
        // No immediate redirect; wait for verification
      } else {
        setSubmitState({ loading: false, error: data.error || "Signup failed.", success: false });
      }
    } catch (err) {
      console.error(err);
      setSubmitState({ loading: false, error: "Network error occurred.", success: false });
    }
  };

  return (
    <div className="flex min-h-[70vh] flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center items-center gap-3">
          <img
            src="/telegram_vacancy_logo.png"
            alt="EthioWork Logo"
            className="h-10 w-10 rounded-xl object-cover border border-primary/20 shadow-sm"
          />
          <span className="font-extrabold text-xl tracking-tight text-primary">
            EthioWork
          </span>
        </Link>
        <h2 className="mt-4 text-center text-xl font-bold tracking-tight text-foreground">
          Create a new account
        </h2>
        <p className="mt-1 text-center text-xs text-muted">
          Already registered?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign in here
          </Link>
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-6 py-8 shadow-sm rounded-xl border border-border sm:px-10">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {submitState.success && !verificationSent && (
              <div className="bg-emerald-50 text-emerald-800 text-xs p-2.5 rounded border border-emerald-200">
                🎉 Account created! Sending verification email...
              </div>
            )}
            {verificationSent && (
              <div className="bg-emerald-50 text-emerald-800 text-xs p-2.5 rounded border border-emerald-200">
                ✅ Verification email sent! Please check your inbox and click the link.
                <div className="mt-2">
                  <Link href="/login" className="font-semibold text-primary hover:underline">
                    Go to Login after verification
                  </Link>
                </div>
              </div>
            )}

            {submitState.error && (
              <div className="bg-red-50 text-red-800 text-xs p-2.5 rounded border border-red-200">
                {submitState.error}
              </div>
            )}

            {/* Role selector tab */}
            <div>
              <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-2">
                I want to register as a:
              </label>
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "candidate" })}
                  className={`py-2 rounded-md font-bold text-center transition-all ${
                    formData.role === "candidate"
                      ? "bg-primary text-white shadow-sm"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  Candidate
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "employer" })}
                  className={`py-2 rounded-md font-bold text-center transition-all ${
                    formData.role === "employer"
                      ? "bg-primary text-white shadow-sm"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  Employer
                </button>
              </div>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-[10px] font-bold text-muted uppercase tracking-wider">
                Full Name / Organization Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={formData.role === "candidate" ? "Abebe Bikila" : "Kerchanshe Coffee Trading"}
                className="mt-1 w-full rounded-lg border border-border bg-slate-50 px-3 py-2 text-xs text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary premium-input"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-[10px] font-bold text-muted uppercase tracking-wider">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="abebe@example.com"
                className="mt-1 w-full rounded-lg border border-border bg-slate-50 px-3 py-2 text-xs text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary premium-input"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-[10px] font-bold text-muted uppercase tracking-wider">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="mt-1 w-full rounded-lg border border-border bg-slate-50 px-3 py-2 text-xs text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary premium-input"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={submitState.loading || submitState.success}
                className="w-full inline-flex justify-center items-center rounded-lg bg-primary py-2.5 text-xs font-bold text-white shadow hover:bg-secondary transition-all disabled:opacity-50 cursor-pointer"
              >
                {submitState.loading ? "Registering Account..." : "Create Account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
