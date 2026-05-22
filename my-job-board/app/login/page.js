// app/login/page.js
"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [submitState, setSubmitState] = useState({ loading: false, error: "", success: false });
  const [signedUpMsg, setSignedUpMsg] = useState(false);

  useEffect(() => {
    if (searchParams.get("signup_success") === "true") {
      setSignedUpMsg(true);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitState({ loading: true, error: "", success: false });
    setSignedUpMsg(false);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setSubmitState({ loading: false, error: "", success: false });

      if (res.ok) {
        setSubmitState({ loading: false, error: "", success: true });
        router.push("/dashboard");
        router.refresh();
      } else {
        setSubmitState({ loading: false, error: data.error || "Login failed.", success: false });
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
          Sign in to your account
        </h2>
        <p className="mt-1 text-center text-xs text-muted">
          New to EthioWork?{" "}
          <Link href="/signup" className="font-semibold text-primary hover:underline">
            Register here
          </Link>
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-6 py-8 shadow-sm rounded-xl border border-border sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {signedUpMsg && (
              <div className="bg-emerald-50 text-emerald-800 text-xs p-2.5 rounded border border-emerald-200">
                🎉 Registration completed! Please sign in using your new credentials.
              </div>
            )}

            {submitState.success && (
              <div className="bg-emerald-50 text-emerald-800 text-xs p-2.5 rounded border border-emerald-200">
                🔐 Access authorized! Opening dashboard...
              </div>
            )}

            {submitState.error && (
              <div className="bg-red-50 text-red-800 text-xs p-2.5 rounded border border-red-200">
                {submitState.error}
              </div>
            )}

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
                autoComplete="current-password"
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
                {submitState.loading ? "Checking Credentials..." : "Sign In"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-xs">Loading login form...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
