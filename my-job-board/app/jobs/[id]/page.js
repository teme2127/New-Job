import Link from "next/link";
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import Job from "@/models/Job";
import { presentJob } from "@/lib/jobPresentation";
import JobDetails from "@/components/JobDetails";
export async function generateMetadata({ params }) {
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return { title: "Opportunity not found | EthioWork" };
  try { await dbConnect(); const job = await Job.findById(id); return { title: job ? `${job.title} at ${job.company} | EthioWork` : "Opportunity not found | EthioWork" }; }
  catch { return { title: "Opportunity | EthioWork" }; }
}
export default async function JobDetailPage({ params }) {
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) notFound();
  let job, loadError = false;
  try { await dbConnect(); const result = await Job.findById(id); job = result ? presentJob(result) : null; }
  catch { loadError = true; }
  if (!loadError && !job) notFound();
  return <div className="detail-route"><nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/jobs">Opportunities</Link><span>/</span><span>{job?.title || "Job details"}</span></nav>{loadError ? <div role="alert" className="notice notice-error">This opportunity is temporarily unavailable. Please try again later.</div> : <JobDetails job={job} fullPage />}</div>;
}
