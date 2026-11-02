import Link from "next/link";
import Icon from "./Icon";
export default function JobCard({ job }) {
  const deadline = job.deadline ? new Date(job.deadline) : null;
  return <article className="job-card"><div className="company-monogram" aria-hidden="true">{job.company?.slice(0, 2).toUpperCase() || "EW"}</div><div className="job-card-content"><div className="job-card-company">{job.company}<span className="job-type">{job.type}</span></div><h3><Link href={`/jobs/${job._id || job.id}`}>{job.title}</Link></h3><div className="job-card-meta"><span><Icon name="pin" size={14} />{job.location}</span><span>{job.salary}</span></div><div className="job-card-bottom"><span className="category-tag">{job.category}</span>{deadline && <span>Apply by {deadline.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>}</div></div><Link className="job-card-arrow" href={`/jobs/${job._id || job.id}`} aria-label={`View ${job.title}`}><Icon size={20} /></Link></article>;
}
