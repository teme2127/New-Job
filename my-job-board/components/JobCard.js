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
    <div className="group flex flex-col justify-between rounded-xl border border-border bg-white p-5 shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-md">
      <div>
        {/* Top line info */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            {/* Logo placeholder */}
            <div className={`flex h-11 w-11 items-center justify-center rounded-lg font-bold text-lg shadow-sm border border-slate-100 ${job.logoBg || "bg-primary/5 text-primary"}`}>
              {job.logo || "🏢"}
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">{job.company}</p>
              <p className="text-[10px] text-muted">{getRelativeTime(job.postedAt)}</p>
            </div>
          </div>
          
          <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${jobTypeBadge}`}>
            {job.type}
          </span>
        </div>

        {/* Job Title */}
        <Link href={`/jobs/${job.id || job._id}`} className="block focus:outline-none">
          <h3 className="text-base font-bold text-foreground hover:text-primary transition-colors line-clamp-1">
            {job.title}
          </h3>
        </Link>

        {/* Location & Salary */}
        <div className="mt-2 flex flex-wrap gap-y-1 gap-x-4 text-xs text-muted">
          <div className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <span>{job.location}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.22.058a2 2 0 001.78-.588l1.458-1.459a2 2 0 00.588-1.78l-.058-.22m-7.917 2.113L7.5 12m5.277 5.277L15 15m-3-9.5V6M6 6h12" />
            </svg>
            <span className="font-semibold text-primary">{job.salary}</span>
          </div>
        </div>

        {/* Tags */}
        {job.tags && job.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {job.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center rounded bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Truncated description */}
        {!isOpen && (
          <p className="mt-3 text-xs text-muted line-clamp-2 leading-relaxed">
            {job.description}
          </p>
        )}

        {/* Accordion content */}
        <div className={`accordion-content mt-4 border-t border-dashed border-border pt-4 ${isOpen ? "open" : ""}`}>
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg text-xs mb-4">
            <div>
              <span className="text-muted block text-[10px] uppercase font-bold">Career Level</span>
              <span className="font-semibold text-foreground">{job.careerLevel || "Mid Level"}</span>
            </div>
            <div>
              <span className="text-muted block text-[10px] uppercase font-bold">Deadline</span>
              <span className="font-semibold text-red-700">{getDeadlineText(job.deadline)}</span>
            </div>
            <div>
              <span className="text-muted block text-[10px] uppercase font-bold">Category / Sector</span>
              <span className="font-semibold text-foreground">{job.category || "General"}</span>
            </div>
            <div>
              <span className="text-muted block text-[10px] uppercase font-bold">Experience Required</span>
              <span className="font-semibold text-foreground">{job.experience || "Not specified"}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="text-xs font-bold text-foreground">Job Description</h4>
              <p className="text-xs text-muted leading-relaxed mt-1 whitespace-pre-line">{job.description}</p>
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
              className="text-xs font-bold bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-all"
            >
              {showApplyForm ? "Cancel Apply" : "Apply for Job"}
            </button>
          </div>

          {/* Quick Apply Form */}
          {showApplyForm && (
            <form onSubmit={handleApplySubmit} className="mt-4 p-3 border border-border bg-slate-50 rounded-lg space-y-3">
              <h4 className="text-xs font-bold text-primary">Quick Application</h4>
              
              {submitState.success ? (
                <div className="bg-emerald-50 text-emerald-800 text-xs p-2.5 rounded border border-emerald-200">
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
                    className="w-full py-2 bg-primary text-white rounded text-xs font-bold hover:bg-secondary transition-all disabled:opacity-50"
                  >
                    {submitState.loading ? "Submitting..." : "Submit Application"}
                  </button>
                </>
              )}
            </form>
          )}
        </div>
      </div>

      {/* Card Actions Bottom */}
      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-xs font-bold text-primary hover:text-secondary flex items-center gap-1 cursor-pointer"
        >
          {isOpen ? "Show Less" : "See More"}
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
          className="text-xs font-bold text-accent hover:text-primary flex items-center gap-0.5"
        >
          Details Page
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
