// components/JobsSearchPortal.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ApplyModal from "./ApplyModal";

export default function JobsSearchPortal({ initialJobs }) {
  const [jobs, setJobs] = useState(initialJobs || []);
  const [selectedJob, setSelectedJob] = useState(null);
  
  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  useEffect(() => {
    if (jobs.length > 0 && !selectedJob) {
      setSelectedJob(jobs[0]);
    }
  }, [jobs]);

  // Filter jobs dynamically
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.tags && job.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesCategory = selectedCategory ? job.category === selectedCategory : true;
    const matchesType = selectedType ? job.type === selectedType : true;
    const matchesExperience = selectedExperience ? job.experience === selectedExperience : true;
    
    const matchesLocation = selectedLocation
      ? job.location.toLowerCase().includes(selectedLocation.toLowerCase())
      : true;

    return matchesSearch && matchesCategory && matchesType && matchesExperience && matchesLocation;
  });

  const handleJobSelect = (job) => {
    setSelectedJob(job);
    // Smooth scroll back to top of detail pane on mobile/tablet if needed
    const detailPane = document.getElementById("detail-pane");
    if (detailPane) {
      detailPane.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const categoriesList = ["NGO", "Healthcare", "Agriculture", "Banking", "Trading & Distribution", "General"];
  const jobTypesList = ["Full-time", "Part-time", "Contract", "Remote", "Internship"];
  const experienceLevels = ["Junior", "Mid-level", "Senior", "Lead / Staff", "3+ Years", "4+ Years", "5+ Years", "6+ Years"];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Header Filter Roster */}
      <div className="bg-white border border-border p-4 rounded-xl shadow-sm mb-6 space-y-4">
        {/* Search & Location Dual Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative md:col-span-2">
            <svg className="absolute left-3.5 top-3 h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by job title, keywords, or company name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-border rounded-lg pl-10 pr-4 py-2.5 text-xs text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary premium-input"
            />
          </div>
          <div className="relative">
            <svg className="absolute left-3.5 top-3 h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <input
              type="text"
              placeholder="Filter by location (e.g. Addis Ababa)"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full bg-slate-50 border border-border rounded-lg pl-10 pr-4 py-2.5 text-xs text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary premium-input"
            />
          </div>
        </div>

        {/* Filter Pills Grid */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border">
          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase text-muted">Sector:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-border rounded-md px-2 py-1 text-xs text-foreground focus:outline-none focus:border-primary"
            >
              <option value="">All Sectors</option>
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Type Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase text-muted">Type:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-slate-50 border border-border rounded-md px-2 py-1 text-xs text-foreground focus:outline-none focus:border-primary"
            >
              <option value="">All Types</option>
              {jobTypesList.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Experience Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase text-muted">Experience:</span>
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="bg-slate-50 border border-border rounded-md px-2 py-1 text-xs text-foreground focus:outline-none focus:border-primary"
            >
              <option value="">All Levels</option>
              {experienceLevels.map((exp) => (
                <option key={exp} value={exp}>{exp}</option>
              ))}
            </select>
          </div>

          {/* Reset Filters Trigger */}
          {(searchQuery || selectedCategory || selectedType || selectedExperience || selectedLocation) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("");
                setSelectedType("");
                setSelectedExperience("");
                setSelectedLocation("");
              }}
              className="text-[10px] font-bold text-red-600 hover:text-red-700 hover:underline cursor-pointer ml-auto"
            >
              Reset All Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Split Screen Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column (Master List) - 5 Cols */}
        <div className="lg:col-span-5 space-y-3 h-[70vh] overflow-y-auto pr-1">
          <p className="text-[11px] font-bold text-muted uppercase tracking-wider pl-1">
            Vacancies List ({filteredJobs.length})
          </p>

          {filteredJobs.length === 0 ? (
            <div className="text-center bg-white border border-border rounded-xl p-8 shadow-sm">
              <span className="text-xl block mb-2">🔍</span>
              <h4 className="font-bold text-foreground text-xs">No matching listings found</h4>
              <p className="text-[11px] text-muted mt-1">Try resetting filters to explore all active positions.</p>
            </div>
          ) : (
            filteredJobs.map((job) => {
              const isSelected = selectedJob && (selectedJob._id === job._id || selectedJob.id === job.id);
              const isNGO = job.category === "NGO";
              const isBanking = job.category === "Banking";
              
              return (
                <div
                  key={job._id || job.id}
                  onClick={() => handleJobSelect(job)}
                  className={`group relative p-4 rounded-xl border transition-all duration-200 cursor-pointer flex justify-between items-start ${
                    isSelected
                      ? "bg-white border-primary shadow shadow-primary/5"
                      : "bg-white border-border hover:border-slate-300 hover:shadow-sm"
                  }`}
                >
                  <div className="space-y-1.5 max-w-[80%]">
                    {/* Top Company Row */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-foreground truncate">{job.company}</span>
                      <span className="text-[8px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                        {job.type}
                      </span>
                    </div>

                    {/* Job Title */}
                    <h3 className={`text-xs font-bold transition-colors truncate ${
                      isSelected ? "text-primary font-extrabold" : "text-foreground group-hover:text-primary"
                    }`}>
                      {job.title}
                    </h3>

                    {/* Location and Salary */}
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-muted">
                      <span className="flex items-center gap-1">📍 {job.location}</span>
                      <span className="font-semibold text-primary">💵 {job.salary}</span>
                    </div>
                  </div>

                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-sm border border-slate-100 ${job.logoBg || "bg-primary/5 text-primary"}`}>
                    {job.logo || "💼"}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column (Detail View) - 7 Cols */}
        <div id="detail-pane" className="lg:col-span-7 bg-white border border-border rounded-xl shadow-sm h-[70vh] overflow-y-auto flex flex-col">
          {selectedJob ? (
            <div className="flex-grow flex flex-col">
              {/* Detail Banner Header */}
              <div className="p-6 border-b border-border bg-slate-50/50 flex justify-between items-start gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded uppercase">
                      {selectedJob.category || "General"}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded uppercase">
                      {selectedJob.experience || "Mid-Level"}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-foreground leading-snug">
                    {selectedJob.title}
                  </h2>
                  <p className="text-xs font-bold text-primary">{selectedJob.company}</p>
                </div>
                
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-xl font-bold border border-slate-200/50 ${selectedJob.logoBg || "bg-primary/5 text-primary"}`}>
                  {selectedJob.logo || "💼"}
                </div>
              </div>

              {/* Detail Contents */}
              <div className="p-6 space-y-6 flex-grow">
                {/* Specifications Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-border/80 text-xs">
                  <div>
                    <span className="text-muted block text-[9px] uppercase font-bold">Salary Range</span>
                    <span className="font-bold text-foreground">{selectedJob.salary}</span>
                  </div>
                  <div>
                    <span className="text-muted block text-[9px] uppercase font-bold">Location</span>
                    <span className="font-bold text-foreground">{selectedJob.location}</span>
                  </div>
                  <div>
                    <span className="text-muted block text-[9px] uppercase font-bold">Job Type</span>
                    <span className="font-bold text-foreground">{selectedJob.type}</span>
                  </div>
                  <div>
                    <span className="text-muted block text-[9px] uppercase font-bold">Deadline</span>
                    <span className="font-bold text-red-700">
                      {selectedJob.deadline ? new Date(selectedJob.deadline).toLocaleDateString() : "Open"}
                    </span>
                  </div>
                </div>

                {/* Main description details */}
                <div className="space-y-4 text-xs text-muted-foreground leading-relaxed font-normal">
                  <div>
                    <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">Role Overview</h3>
                    <p className="whitespace-pre-line text-xs text-muted leading-relaxed font-normal">{selectedJob.description}</p>
                  </div>

                  {selectedJob.responsibilities && selectedJob.responsibilities.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">Primary Responsibilities</h3>
                      <ul className="list-disc pl-4 space-y-1">
                        {selectedJob.responsibilities.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">Qualifications & Skills</h3>
                      <ul className="list-disc pl-4 space-y-1">
                        {selectedJob.requirements.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedJob.benefits && selectedJob.benefits.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">Benefits & Perks</h3>
                      <ul className="list-disc pl-4 space-y-1">
                        {selectedJob.benefits.map((r, i) => (
                          <li key={i} className="text-emerald-800 font-semibold">{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Sticky Action Band */}
              <div className="p-4 border-t border-border bg-slate-50/50 flex items-center justify-between gap-4 sticky bottom-0">
                <div className="text-xs">
                  <span className="text-muted text-[10px] block">Interested in this role?</span>
                  <span className="font-bold text-foreground">Apply securely on EthioWork</span>
                </div>
                <div className="w-40">
                  <ApplyModal jobId={selectedJob._id || selectedJob.id} jobTitle={selectedJob.title} company={selectedJob.company} />
                </div>
              </div>
            </div>
          ) : (
            <div className="m-auto text-center p-8 space-y-2">
              <span className="text-3xl block">📋</span>
              <h3 className="font-bold text-foreground text-sm">Select a job listing</h3>
              <p className="text-xs text-muted max-w-xs mx-auto">
                Click on any job card in the left list to review its complete details and submit your application.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
