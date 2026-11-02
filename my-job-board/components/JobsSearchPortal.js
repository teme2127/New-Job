"use client";
import { useState } from "react";
import Icon from "./Icon";
import JobDetails from "./JobDetails";
export default function JobsSearchPortal({ initialJobs = [], initialQuery = "", initialCategory = "" }) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const jobs = initialJobs.filter(job => {
    const content = [job.title, job.company, job.description, ...(job.tags || [])].join(" ").toLowerCase();
    return content.includes(query.toLowerCase()) && (!category || job.category === category) && (!type || job.type === type) && job.location.toLowerCase().includes(location.toLowerCase()) && (!experience || job.experience === experience);
  });
  const selected = jobs.find(job => String(job._id || job.id) === selectedId) || jobs[0];
  const categories = [...new Set(["NGO", "Banking", "Healthcare", "Engineering", "Agriculture", "Trading & Distribution", "General", ...initialJobs.map(job => job.category)])].sort();
  const experiences = [...new Set(initialJobs.map(job => job.experience))].sort();
  function reset() { setQuery(""); setCategory(""); setType(""); setLocation(""); setExperience(""); }
  function select(job) {
    setSelectedId(String(job._id || job.id));
    if (window.matchMedia("(max-width: 800px)").matches) document.getElementById("job-detail")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
  }
  return <div className="container-wide search-workspace"><div className="search-toolbar"><div className="search-inputs"><label><Icon name="search" /><span className="sr-only">Search job titles, keywords, or companies</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Job title, keyword, or company" /></label><label><Icon name="pin" /><span className="sr-only">Filter by location</span><input value={location} onChange={e => setLocation(e.target.value)} placeholder="City or region" /></label></div><div className="filter-row"><label>Sector<select value={category} onChange={e => setCategory(e.target.value)}><option value="">All sectors</option>{categories.map(item => <option key={item}>{item}</option>)}</select></label><label>Job type<select value={type} onChange={e => setType(e.target.value)}><option value="">All job types</option>{["Full-time", "Part-time", "Contract", "Remote", "Internship"].map(item => <option key={item}>{item}</option>)}</select></label><label>Experience<select value={experience} onChange={e => setExperience(e.target.value)}><option value="">All experience levels</option>{experiences.map(item => <option key={item}>{item}</option>)}</select></label>{(query || category || type || location || experience) && <button className="filter-reset" onClick={reset}>Clear filters</button>}</div></div><p className="result-summary" role="status" aria-live="polite">{jobs.length} {jobs.length === 1 ? "opportunity" : "opportunities"} to explore</p><div className="search-results"><div className="result-list" aria-label="Matching vacancies">{jobs.length ? jobs.map(job => { const active = String(selected?._id || selected?.id) === String(job._id || job.id); return <button key={job._id || job.id} className={`result-button ${active ? "is-selected" : ""}`} onClick={() => select(job)} aria-pressed={active} aria-controls="job-detail"><div className="result-top"><span className="result-company">{job.company}</span><span className="company-monogram">{job.company?.slice(0, 2).toUpperCase()}</span></div><h3>{job.title}</h3><div className="result-meta"><span>{job.location}</span><span>·</span><span>{job.type}</span></div><span className="category-tag">{job.category}</span></button>; }) : <div className="empty-state"><Icon name="search" size={32} /><h3>No matches just yet.</h3><p>Try a different keyword, widen your location, or clear your filters.</p><button onClick={reset} className="text-link">Clear all filters <Icon size={16} /></button></div>}</div><div id="job-detail" className="search-detail">{selected ? <JobDetails key={selected._id || selected.id} job={selected} /> : <div className="empty-state"><Icon name="bag" size={36} /><h3>A new chapter starts with a role.</h3><p>Available opportunities and their details will appear here.</p></div>}</div></div></div>;
}
