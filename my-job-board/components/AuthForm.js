"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon from "./Icon";
export default function AuthForm({ signup = false }) {
  const router = useRouter();
  const [data, setData] = useState({ name: "", email: "", password: "", role: "candidate" });
  const [showPassword, setShowPassword] = useState(false);
  const [state, setState] = useState({ loading: false, error: "", success: false });
  const change = e => setData({ ...data, [e.target.name]: e.target.value });
  async function submit(e) {
    e.preventDefault(); setState({ loading: true, error: "", success: false });
    try {
      const response = await fetch(`/api/auth/${signup ? "signup" : "login"}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const result = await response.json().catch(() => null);
      if (!result) throw new Error(response.ok ? "We received an unexpected response. Please try again." : "The account service returned an unexpected response. Please try again shortly.");
      if (!response.ok) throw new Error(result.error || "Something went wrong. Please try again.");
      setState({ loading: false, error: "", success: true });
      if (!signup) { router.push("/dashboard"); router.refresh(); }
    } catch (error) { setState({ loading: false, error: error instanceof TypeError ? "We couldn’t reach the account service. Check your internet connection and try again." : error.message || "Unable to connect. Please try again.", success: false }); }
  }
  return <div className="auth-layout"><aside className="auth-aside"><p className="eyebrow">A LITTLE AMBITION GOES A LONG WAY</p><h1>{signup ? <>A fresh start.<br />A world of<br /><em>possibilities.</em></> : <>Your next<br />chapter is<br /><em>waiting.</em></>}</h1><p>Find meaningful work, connect with growing teams, and build a future that feels like you.</p><div className="auth-benefits"><span><Icon name="check" size={17} /> Discover opportunities across Ethiopia</span><span><Icon name="check" size={17} /> Keep your applications in one place</span><span><Icon name="check" size={17} /> Take the next step at your own pace</span></div></aside><section className="auth-main"><div className="auth-form"><p className="eyebrow">{signup ? "LET’S GET YOU STARTED" : "WELCOME BACK"}</p><h2>{signup ? "Create your account" : "Make your next move."}</h2><p className="auth-description">{signup ? "Already have an account? " : "New to EthioWork? "}<Link href={signup ? "/login" : "/signup"}>{signup ? "Sign in" : "Create an account"}</Link></p>
    {state.error && <p role="alert" className="notice notice-error">{state.error}</p>}
    {state.success && <div role="status" className="notice notice-success">{signup ? <>You’re all set. <Link href="/login" className="underline">Sign in to your new account.</Link></> : "You’re signed in. Opening your dashboard…"}</div>}
    <form onSubmit={submit} className="form-stack">
      {signup && <fieldset><legend className="text-xs font-medium text-muted">I’m here to</legend><div className="role-options">{[{ value: "candidate", label: "Find a job", icon: "search" }, { value: "employer", label: "Hire talent", icon: "users" }].map(role => <label className="role-option" key={role.value}><input type="radio" name="role" value={role.value} checked={data.role === role.value} onChange={change} /><Icon name={role.icon} size={17} />{role.label}</label>)}</div></fieldset>}
      {signup && <label className="form-field">Full name<input name="name" autoComplete="name" maxLength={200} value={data.name} onChange={change} placeholder="Your full name" required /></label>}
      <label className="form-field">Email address<input name="email" type="email" autoComplete="email" maxLength={254} value={data.email} onChange={change} placeholder="you@example.com" required /></label>
      <div className="form-field"><label htmlFor="account-password">Password</label><div className="password-field"><input id="account-password" name="password" type={showPassword ? "text" : "password"} autoComplete={signup ? "new-password" : "current-password"} minLength={6} maxLength={1024} value={data.password} onChange={change} placeholder={signup ? "Create a password" : "Enter your password"} required /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword}><Icon name="eye" size={18} /></button></div>{signup && <span className="text-xs text-muted font-normal">Use at least 6 characters.</span>}</div>
      <button type="submit" className="button button-dark" disabled={state.loading || state.success}>{state.loading ? "Please wait…" : signup ? "Create account" : "Sign in"}<Icon size={17} /></button>
    </form><p className="auth-note">Your ambitions belong here.</p></div></section></div>;
}
