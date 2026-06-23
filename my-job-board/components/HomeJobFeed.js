// components/HomeJobFeed.js
"use client";

import { useState } from "react";
import JobCard from "./JobCard";
import Link from "next/link";

export default function HomeJobFeed({ initialJobs }) {
  const [activeTab, setActiveTab] = useState("latest");

  // Get Latest Jobs (up to 5)
  const latestJobs = initialJobs.slice(0, 5);

  // Get NGO Jobs (up to 5)
  const ngoJobs = initialJobs.filter((job) => job.category === "NGO").slice(0, 5);

  const displayedJobs = activeTab === "latest" ? latestJobs : ngoJobs;

  return (
    <div className="w-full">
      {/* Tab Switcher */}
      <div className="flex border-b border-border/80 mb-6 justify-center sm:justify-start gap-6">
        <button
          onClick={() => setActiveTab("latest")}
          className={`pb-3 text-sm font-extrabold transition-all relative cursor-pointer ${
            activeTab === "latest"
              ? "text-primary font-black"
              : "text-muted hover:text-foreground"
          }`}
        >
          Latest Vacancies
          {activeTab === "latest" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("ngo")}
          className={`pb-3 text-sm font-extrabold transition-all relative cursor-pointer ${
            activeTab === "ngo"
              ? "text-primary font-black"
              : "text-muted hover:text-foreground"
          }`}
        >
          NGO Opportunities 🌍
          {activeTab === "ngo" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></span>
          )}
        </button>
      </div>

      {/* Row List Feed */}
      <div className="space-y-4">
        {displayedJobs.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 border border-border/50 rounded-xl">
            <span className="text-2xl block mb-1">📋</span>
            <p className="text-xs text-muted font-bold">No active jobs in this category right now.</p>
          </div>
        ) : (
          displayedJobs.map((job) => (
            <JobCard key={job._id || job.id} job={job} />
          ))
        )}
      </div>

      {/* View All CTA */}
      <div className="mt-8 text-center">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 justify-center rounded-xl bg-primary text-white hover:bg-secondary px-6 py-3 text-xs font-bold shadow-md hover:shadow-lg hover:translate-y-[-1px] transition-all cursor-pointer"
        >
          Explore All Vacancies
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
