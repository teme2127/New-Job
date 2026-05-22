// app/post-a-job/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PostJobPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdJob, setCreatedJob] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    category: "NGO",
    location: "",
    type: "Full-time",
    experience: "Mid-level",
    salary: "",
    deadline: "",
    description: "",
    responsibilities: "",
    requirements: "",
    benefits: "",
    tags: "",
    companyWebsite: "",
    companyEmail: "",
  });

  useEffect(() => {
    async function checkUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setAuthLoading(false);
      }
    }
    checkUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setCreatedJob(data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setCreatedJob(null);
    setFormData({
      title: "",
      company: "",
      category: "NGO",
      location: "",
      type: "Full-time",
      experience: "Mid-level",
      salary: "",
      deadline: "",
      description: "",
      responsibilities: "",
      requirements: "",
      benefits: "",
      tags: "",
      companyWebsite: "",
      companyEmail: "",
    });
  };

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-xs text-muted">
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        Verifying Session Permissions...
      </div>
    );
  }

  // Not Logged In
  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-500 font-extrabold text-xl mx-auto mb-4 border border-amber-100 shadow-sm">
          ⚠️
        </span>
        <h1 className="text-xl font-bold text-foreground tracking-tight">
          Employer Access Required
        </h1>
        <p className="mt-2 text-xs text-muted leading-relaxed">
          Please sign in as an Employer to post vacancies and manage applicants on EthioWork.
        </p>
        <div className="mt-6 flex justify-center gap-3 text-xs">
          <Link
            href="/login"
            className="inline-flex justify-center items-center rounded-lg bg-primary px-4 py-2 font-bold text-white shadow hover:bg-secondary transition-all"
          >
            Login Portal
          </Link>
          <Link
            href="/signup"
            className="inline-flex justify-center items-center rounded-lg border border-border px-4 py-2 font-bold text-muted hover:bg-slate-50 transition-all"
          >
            Register Account
          </Link>
        </div>
      </div>
    );
  }

  // Logged in but not Employer
  if (user.role !== "employer") {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500 font-extrabold text-xl mx-auto mb-4 border border-red-100 shadow-sm">
          ❌
        </span>
        <h1 className="text-xl font-bold text-foreground tracking-tight">
          Unauthorized Action
        </h1>
        <p className="mt-2 text-xs text-muted leading-relaxed">
          Your current account is registered as a **Candidate**. Only Employer profiles can publish vacancies.
        </p>
        <div className="mt-6 flex justify-center gap-3 text-xs">
          <Link
            href="/dashboard"
            className="inline-flex justify-center items-center rounded-lg bg-primary px-4 py-2 font-bold text-white shadow hover:bg-secondary transition-all"
          >
            Go to Candidate Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (createdJob) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 font-extrabold text-xl mx-auto mb-4 border border-emerald-100 shadow-sm">
          ✓
        </span>
        
        <h1 className="text-xl font-bold text-foreground tracking-tight">
          Vacancy Published Successfully!
        </h1>
        
        <p className="mt-2 text-xs text-muted max-w-md mx-auto leading-relaxed">
          Your vacancy opening for <span className="font-semibold text-primary">{createdJob.title}</span> at <span className="font-semibold text-foreground">{createdJob.company}</span> is now live in the directory.
        </p>

        <div className="mt-6 flex justify-center gap-3 text-xs">
          <Link
            href={`/jobs/${createdJob._id || createdJob.id}`}
            className="inline-flex justify-center items-center rounded-lg bg-primary px-4 py-2.5 font-bold text-white shadow hover:bg-secondary transition-all"
          >
            View Live Listing
          </Link>
          <button
            onClick={handleReset}
            className="inline-flex justify-center items-center rounded-lg border border-border px-4 py-2.5 font-bold text-muted hover:bg-slate-50 transition-all cursor-pointer"
          >
            Post Another Job
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
          Post a Vacancy Listing
        </h1>
        <p className="mt-1 text-xs text-muted max-w-md mx-auto">
          Reach thousands of daily Ethiopian professionals, NGO staff, financial analysts, and healthcare workers.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-150 p-3.5 flex gap-2 text-xs text-red-800">
          <span className="font-bold">⚠️</span>
          <p>{errorMsg}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 sm:p-8 rounded-xl border border-border shadow-sm">
        {/* Section 1: Role Information */}
        <div>
          <h3 className="text-sm font-bold text-foreground border-b border-border pb-2 mb-4">
            1. General Vacancy Info
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-[10px] font-bold text-muted uppercase tracking-wider">
                Vacancy Title *
              </label>
              <input
                id="title"
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Finance & Grants Officer"
                className="mt-1 w-full rounded-lg border border-border bg-slate-50 px-3.5 py-2 text-xs text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary premium-input"
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-[10px] font-bold text-muted uppercase tracking-wider">
                Company / NGO Name *
              </label>
              <input
                id="company"
                type="text"
                name="company"
                required
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. United Nations ECA"
                className="mt-1 w-full rounded-lg border border-border bg-slate-50 px-3.5 py-2 text-xs text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary premium-input"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-[10px] font-bold text-muted uppercase tracking-wider">
                Sector Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-border bg-slate-50 px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary"
              >
                <option value="NGO">NGO</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Banking">Banking</option>
                <option value="Trading & Distribution">Trading & Distribution</option>
                <option value="General">General</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Job Settings & Compensation */}
        <div>
          <h3 className="text-sm font-bold text-foreground border-b border-border pb-2 mb-4">
            2. Settings & Compensation
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="location" className="block text-[10px] font-bold text-muted uppercase tracking-wider">
                Location *
              </label>
              <input
                id="location"
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Addis Ababa, Ethiopia"
                className="mt-1 w-full rounded-lg border border-border bg-slate-50 px-3.5 py-2 text-xs text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary premium-input"
              />
            </div>

            <div>
              <label htmlFor="salary" className="block text-[10px] font-bold text-muted uppercase tracking-wider">
                Salary Range / Compensation *
              </label>
              <input
                id="salary"
                type="text"
                name="salary"
                required
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g. Gross, Negotiable"
                className="mt-1 w-full rounded-lg border border-border bg-slate-50 px-3.5 py-2 text-xs text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary premium-input"
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-[10px] font-bold text-muted uppercase tracking-wider">
                Employment Type *
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-border bg-slate-50 px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div>
              <label htmlFor="experience" className="block text-[10px] font-bold text-muted uppercase tracking-wider">
                Experience Level / Requirement *
              </label>
              <select
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-border bg-slate-50 px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary"
              >
                <option value="Junior">Junior</option>
                <option value="Mid-level">Mid-level</option>
                <option value="Senior">Senior</option>
                <option value="Lead / Staff">Lead / Staff</option>
                <option value="3+ Years">3+ Years</option>
                <option value="4+ Years">4+ Years</option>
                <option value="5+ Years">5+ Years</option>
                <option value="6+ Years">6+ Years</option>
              </select>
            </div>

            <div>
              <label htmlFor="deadline" className="block text-[10px] font-bold text-muted uppercase tracking-wider">
                Application Deadline *
              </label>
              <input
                id="deadline"
                type="date"
                name="deadline"
                required
                value={formData.deadline}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-border bg-slate-50 px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Descriptions */}
        <div>
          <h3 className="text-sm font-bold text-foreground border-b border-border pb-2 mb-4">
            3. Vacancy Details & Specifications
          </h3>

          <div className="space-y-4">
            <div>
              <label htmlFor="description" className="block text-[10px] font-bold text-muted uppercase tracking-wider">
                Vacancy Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the main objectives and scope of the role..."
                className="mt-1 w-full rounded-lg border border-border bg-slate-50 px-3.5 py-2 text-xs text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary resize-none premium-input"
              ></textarea>
            </div>

            <div>
              <label htmlFor="responsibilities" className="block text-[10px] font-bold text-muted uppercase tracking-wider">
                Key Responsibilities (One per line)
              </label>
              <textarea
                id="responsibilities"
                name="responsibilities"
                rows="3"
                value={formData.responsibilities}
                onChange={handleChange}
                placeholder="e.g. Conduct financial audits&#10;Coordinate with project coordinators&#10;Write quarterly status reports"
                className="mt-1 w-full rounded-lg border border-border bg-slate-50 px-3.5 py-2 text-xs text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary resize-none premium-input"
              ></textarea>
            </div>

            <div>
              <label htmlFor="requirements" className="block text-[10px] font-bold text-muted uppercase tracking-wider">
                Qualifications & Skills (One per line)
              </label>
              <textarea
                id="requirements"
                name="requirements"
                rows="3"
                value={formData.requirements}
                onChange={handleChange}
                placeholder="e.g. Degree in Finance or Accounting&#10;2+ years NGO project experience&#10;Fluent English & Amharic skills"
                className="mt-1 w-full rounded-lg border border-border bg-slate-50 px-3.5 py-2 text-xs text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary resize-none premium-input"
              ></textarea>
            </div>

            <div>
              <label htmlFor="benefits" className="block text-[10px] font-bold text-muted uppercase tracking-wider">
                Benefits & Perks (One per line)
              </label>
              <textarea
                id="benefits"
                name="benefits"
                rows="2"
                value={formData.benefits}
                onChange={handleChange}
                placeholder="e.g. Training stipends&#10;Flexible working hours&#10;Full medical cover"
                className="mt-1 w-full rounded-lg border border-border bg-slate-50 px-3.5 py-2 text-xs text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary resize-none premium-input"
              ></textarea>
            </div>
            
            <div>
              <label htmlFor="tags" className="block text-[10px] font-bold text-muted uppercase tracking-wider">
                Tags / Keywords (Comma-separated)
              </label>
              <input
                id="tags"
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g. NGO, Finance, Auditor, AddisAbaba"
                className="mt-1 w-full rounded-lg border border-border bg-slate-50 px-3.5 py-2 text-xs text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary premium-input"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Company Information */}
        <div>
          <h3 className="text-sm font-bold text-foreground border-b border-border pb-2 mb-4">
            4. Contact Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="companyWebsite" className="block text-[10px] font-bold text-muted uppercase tracking-wider">
                Website Link
              </label>
              <input
                id="companyWebsite"
                type="url"
                name="companyWebsite"
                value={formData.companyWebsite}
                onChange={handleChange}
                placeholder="e.g. https://unece.org"
                className="mt-1 w-full rounded-lg border border-border bg-slate-50 px-3.5 py-2 text-xs text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary premium-input"
              />
            </div>

            <div>
              <label htmlFor="companyEmail" className="block text-[10px] font-bold text-muted uppercase tracking-wider">
                Application Email *
              </label>
              <input
                id="companyEmail"
                type="email"
                required
                name="companyEmail"
                value={formData.companyEmail}
                onChange={handleChange}
                placeholder="e.g. vacancies@un.org"
                className="mt-1 w-full rounded-lg border border-border bg-slate-50 px-3.5 py-2 text-xs text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary premium-input"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 rounded-lg bg-primary text-xs font-bold text-white shadow hover:bg-secondary transition-all disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? "Publishing vacancy posting..." : "Publish Vacancy Listing"}
        </button>
      </form>
    </div>
  );
}
