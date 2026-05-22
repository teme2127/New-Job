// components/ApplyModal.js
"use client";

import { useState } from "react";

export default function ApplyModal({ jobId, jobTitle, company }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cvText: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          name: formData.name,
          email: formData.email,
          cvText: formData.cvText,
        }),
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (res.ok) {
        setIsSuccess(true);
        setFormData({ name: "", email: "", cvText: "" });
      } else {
        setErrorMessage(data.error || "Failed to submit application. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      setErrorMessage("Network error occurred. Please check your connection.");
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3.5 text-sm font-bold text-white shadow hover:bg-secondary transition-all active:scale-95 whitespace-nowrap cursor-pointer"
      >
        Apply Now
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl transition-all border border-border">
            {/* Close Button */}
            <button
              onClick={() => {
                setIsOpen(false);
                setIsSuccess(false);
                setErrorMessage("");
              }}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {!isSuccess ? (
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-foreground">
                    Apply for this position
                  </h3>
                  <p className="text-xs text-muted mt-0.5">
                    {jobTitle} at <span className="font-semibold text-primary">{company}</span>
                  </p>
                </div>

                {errorMessage && (
                  <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-800 text-xs rounded">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Abebe Bikila"
                      className="w-full rounded-lg border border-border bg-slate-50 px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. abebe@example.com"
                      className="w-full rounded-lg border border-border bg-slate-50 px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-1">
                      CV Details / Cover Letter *
                    </label>
                    <textarea
                      required
                      rows="4"
                      value={formData.cvText}
                      onChange={(e) => setFormData({ ...formData, cvText: e.target.value })}
                      placeholder="Paste your resume or detail your professional experience..."
                      className="w-full rounded-lg border border-border bg-slate-50 px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center rounded-lg bg-primary py-2.5 text-xs font-bold text-white shadow hover:bg-secondary transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="p-6 text-center flex flex-col items-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-xl text-emerald-500 mb-3 border border-emerald-100">
                  ✓
                </span>
                <h3 className="text-base font-bold text-foreground">Application Submitted!</h3>
                <p className="mt-1 text-xs text-muted max-w-xs leading-relaxed">
                  Your application for <span className="font-semibold text-primary">{jobTitle}</span> has been sent successfully. The hiring managers at <span className="font-semibold text-primary">{company}</span> will review your details.
                </p>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setIsSuccess(false);
                  }}
                  className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2 text-xs font-bold text-white shadow hover:bg-secondary transition-all"
                >
                  Close Window
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
