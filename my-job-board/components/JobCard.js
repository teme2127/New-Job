// components/JobCard.js
"use client";

import { useState } from "react";
import Link from "next/link";

export default function JobCard({ job }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", cvText: "" });
  const [submitState, setSubmitState] = useState({ loading: false, success: false, error: "" });

  const getRelativeTime = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1) return "Today";
      if (diffDays === 2) return "Yesterday";
      return `${diffDays} days ago`;
    } catch (e) {
      return "Recently";
    }
  };

  const getDeadlineText = (dateString) => {
    try {
      if (!dateString) return "Not specified";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch (e) {
      return "Open";
    }
  };

  const badgeColors = {
    "Full-time": "bg-emerald-50 text-emerald-800 border-emerald-100",
    "Part-time": "bg-blue-50 text-blue-800 border-blue-100",
    "Contract": "bg-amber-50 text-amber-800 border-amber-100",
    "Remote": "bg-teal-50 text-teal-800 border-teal-100",
    "Internship": "bg-purple-50 text-purple-800 border-purple-100",
  };

  const jobTypeBadge = badgeColors[job.type] || "bg-slate-50 text-slate-700 border-slate-100";

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setSubmitState({ loading: true, success: false, error: "" });

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job.id || job._id,
          name: formData.name,
          email: formData.email,
          cvText: formData.cvText,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitState({ loading: false, success: true, error: "" });
        setFormData({ name: "", email: "", cvText: "" });
      } else {
        setSubmitState({ loading: false, success: false, error: data.error || "Failed to apply" });
      }
    } catch (err) {
      console.error(err);
      setSubmitState({ loading: false, success: false, error: "Network error occurred." });
    }
  };

  return (
    <div className="group relative flex flex-col rounded-xl border border-border bg-white p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-md custom-shadow">
      {/* Left indicator accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20 group-hover:bg-primary transition-colors rounded-l-xl"></div>
      
      {/* Row Header: Flex Row on MD screens */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-grow pl-1">
        {/* Logo and Job Details */}
        <div className="flex items-start gap-4">
          {/* Logo container */}
          <div className={`flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl font-bold text-xl shadow-sm border border-slate-100/50 ${job.logoBg || "bg-primary/5 text-primary"}`}>
            {job.logo || "💼"}
          </div>
          
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-secondary">{job.company}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-slate-350"></span>
              <span className="text-[10px] text-muted">{getRelativeTime(job.postedAt)}</span>
            </div>
            
            <Link href={`/jobs/${job.id || job._id}`} className="block focus:outline-none">
              <h3 className="text-sm font-extrabold text-foreground group-hover:text-primary transition-colors line-clamp-1 leading-snug">
                {job.title}
              </h3>
            </Link>
            
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted">
              <span className="flex items-center gap-1 font-medium">📍 {job.location}</span>
              <span className="flex items-center gap-1 text-primary font-bold">💵 {job.salary}</span>
              <span className="bg-slate-50 text-[9px] text-muted font-extrabold px-1.5 py-0.5 rounded border border-border/50 uppercase tracking-wider">
                {job.category}
              </span>
            </div>
          </div>
        </div>

        {/* Right side: Badge and Quick Actions */}
        <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center w-full md:w-auto border-t md:border-t-0 border-border/60 pt-3 md:pt-0 gap-3">
          <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider ${jobTypeBadge}`}>
            {job.type}
          </span>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-xs font-bold text-muted hover:text-primary transition-colors flex items-center gap-0.5 cursor-pointer"
            >
              {isOpen ? "Less info" : "Quick Apply"}
              <svg
                className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            
            <Link
              href={`/jobs/${job.id || job._id}`}
              className="inline-flex items-center justify-center rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-white px-3 py-1.5 text-xs font-bold transition-all"
            >
              Details ➔
            </Link>
          </div>
        </div>
      </div>

      {/* Accordion dropdown details */}
      <div className={`accordion-content border-t border-dashed border-border mt-4 pt-4 ${isOpen ? "open" : ""}`}>
        <div className="grid grid-cols-2 gap-4 bg-slate-50/80 p-3 rounded-lg text-xs mb-4 border border-border/40">
          <div>
            <span className="text-muted block text-[9px] uppercase font-extrabold">Career Level</span>
            <span className="font-semibold text-foreground">{job.careerLevel || "Mid Level"}</span>
          </div>
          <div>
            <span className="text-muted block text-[9px] uppercase font-extrabold">Deadline</span>
            <span className="font-semibold text-red-700">{getDeadlineText(job.deadline)}</span>
          </div>
          <div>
            <span className="text-muted block text-[9px] uppercase font-extrabold">Category / Sector</span>
            <span className="font-semibold text-foreground">{job.category || "General"}</span>
          </div>
          <div>
            <span className="text-muted block text-[9px] uppercase font-extrabold">Experience Required</span>
            <span className="font-semibold text-foreground">{job.experience || "Not specified"}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <h4 className="text-xs font-bold text-foreground">Job Description</h4>
            <p className="text-xs text-muted leading-relaxed mt-1 whitespace-pre-line font-normal">{job.description}</p>
          </div>

          {job.requirements && job.requirements.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-foreground">Key Requirements</h4>
              <ul className="list-disc pl-4 mt-1 text-xs text-muted space-y-1">
                {job.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Quick Apply Toggle */}
        <div className="mt-4 pt-4 border-t border-border flex justify-end">
          <button
            onClick={() => setShowApplyForm(!showApplyForm)}
            className="text-xs font-bold bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-all cursor-pointer"
          >
            {showApplyForm ? "Cancel Apply" : "Apply for Job"}
          </button>
        </div>

        {/* Quick Apply Form */}
        {showApplyForm && (
          <form onSubmit={handleApplySubmit} className="mt-4 p-3 border border-border bg-slate-50/50 rounded-lg space-y-3">
            <h4 className="text-xs font-bold text-primary">Quick Application</h4>
            
            {submitState.success ? (
              <div className="bg-emerald-50 text-emerald-800 text-xs p-2.5 rounded border border-emerald-200 font-bold">
                🎉 Application submitted successfully!
              </div>
            ) : (
              <>
                {submitState.error && (
                  <div className="bg-red-50 text-red-800 text-xs p-2 rounded border border-red-200">
                    {submitState.error}
                  </div>
                )}
                <div>
                  <label className="block text-[10px] font-bold text-muted uppercase">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Abebe Bikila"
                    className="w-full mt-1 p-2 border border-border rounded bg-white text-xs premium-input"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-muted uppercase">Your Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="abebe@example.com"
                    className="w-full mt-1 p-2 border border-border rounded bg-white text-xs premium-input"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-muted uppercase">CV Summary / Qualifications</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.cvText}
                    onChange={(e) => setFormData({ ...formData, cvText: e.target.value })}
                    placeholder="Detail your professional experience, tools, and background..."
                    className="w-full mt-1 p-2 border border-border rounded bg-white text-xs premium-input"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitState.loading}
                  className="w-full py-2 bg-primary text-white rounded text-xs font-bold hover:bg-secondary transition-all disabled:opacity-50 cursor-pointer"
                >
                  {submitState.loading ? "Submitting..." : "Submit Application"}
                </button>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
