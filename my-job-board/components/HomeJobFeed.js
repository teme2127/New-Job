"use client";
import { useState } from "react";
import Link from "next/link";
import JobCard from "./JobCard";
import Icon from "./Icon";
export default function HomeJobFeed({ initialJobs = [] }) {
  const [tab, setTab] = useState("latest");
  const jobs = (tab === "ngo" ? initialJobs.filter(job => job.category === "NGO") : initialJobs).slice(0, 5);
  return <div><div className="feed-tabs" aria-label="Filter vacancies">{[{ id: "latest", label: "Latest vacancies" }, { id: "ngo", label: "NGO opportunities" }].map(item => <button key={item.id} onClick={() => setTab(item.id)} aria-pressed={tab === item.id} className={tab === item.id ? "active" : ""}>{item.label}</button>)}</div><div className="job-feed">{jobs.length ? jobs.map(job => <JobCard key={job._id || job.id} job={job} />) : <div className="empty-state"><Icon name="bag" size={34} /><h3>Your next opportunity is on its way.</h3><p>No vacancies in this category yet. Check back soon or explore another sector.</p><Link href="/jobs" className="text-link">Explore all sectors <Icon size={16} /></Link></div>}</div><Link href="/jobs" className="feed-more">Explore all vacancies <Icon size={18} /></Link></div>;
}
