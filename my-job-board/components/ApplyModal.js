"use client";
import { useState, useCallback, useId } from "react";
import Dialog from "./Dialog";
import Icon from "./Icon";
export default function ApplyModal({ jobId, jobTitle, company, closed = false }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({ name: "", email: "", cvText: "" });
  const [state, setState] = useState({ loading: false, success: false, error: "" });
  const titleId = useId();
  const close = useCallback(() => setOpen(false), []);
  async function submit(event) {
    event.preventDefault(); setState({ loading: true, success: false, error: "" });
    try {
      const response = await fetch("/api/applications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, jobId }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "We couldn’t submit your application. Please try again.");
      setState({ loading: false, success: true, error: "" });
      setData({ name: "", email: "", cvText: "" });
    } catch (error) { setState({ loading: false, success: false, error: error.message }); }
  }
  function change(event) { setData({ ...data, [event.target.name]: event.target.value }); }
  return <><button type="button" className="button button-dark w-full" disabled={closed} onClick={() => setOpen(true)}>{closed ? "Applications closed" : "Apply for this role"}{!closed && <Icon size={17} />}</button>{open && <Dialog titleId={titleId} onClose={close}>{state.success ? <div className="application-success"><div className="success-icon"><Icon name="check" size={28} /></div><h2 id={titleId}>Your next step is taken.</h2><p>Your application for {jobTitle} has been submitted to {company}. Good luck with your next chapter.</p><button className="button button-dark" onClick={close}>Back to opportunities</button></div> : <><p className="eyebrow">TAKE THE NEXT STEP</p><h2 id={titleId}>Apply for this role</h2><p className="auth-description">{jobTitle}<br /><strong>{company}</strong></p>{state.error && <p role="alert" className="notice notice-error mb-5">{state.error}</p>}<form onSubmit={submit} className="form-stack"><label className="form-field">Full name<input name="name" autoComplete="name" maxLength={200} value={data.name} onChange={change} required placeholder="Your full name" /></label><label className="form-field">Email address<input type="email" name="email" autoComplete="email" maxLength={254} value={data.email} onChange={change} required placeholder="you@example.com" /></label><label className="form-field">Your experience<textarea name="cvText" value={data.cvText} onChange={change} required maxLength={50000} rows={5} placeholder="Introduce yourself and share your relevant experience or paste your resume…" /></label><button type="submit" className="button button-dark" disabled={state.loading}>{state.loading ? "Submitting…" : "Submit application"}<Icon size={17} /></button></form><p className="auth-note">Your details will be shared with the hiring employer.</p></>}</Dialog>}</>;
}
