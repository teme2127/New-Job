// app/jobs/[id]/page.js
import Link from "next/link";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import Job from "@/models/Job";
import ApplyModal from "@/components/ApplyModal";
import { getJobById } from "@/lib/jobsData";

export async function generateMetadata({ params }) {
  const { id } = await params;
  let job = null;
  
  try {
    if (mongoose.Types.ObjectId.isValid(id)) {
      await dbConnect();
      job = await Job.findById(id);
    }
  } catch (e) {
    console.warn("Metadata search failed, using fallback:", e.message);
  }

  if (!job) {
    job = getJobById(id);
  }

  return {
    title: job ? `${job.title} | ${job.company}` : "Job Not Found | EthioWork",
    description: job ? job.description : "Browse career vacancies in Ethiopia",
  };
}

export default async function JobDetailPage({ params }) {
  const { id } = await params;
  let job = null;

  try {
    if (mongoose.Types.ObjectId.isValid(id)) {
      await dbConnect();
      const dbJob = await Job.findById(id);
      if (dbJob) {
        job = JSON.parse(JSON.stringify(dbJob));
      }
    }
  } catch (error) {
    console.warn("MongoDB connection failed on JobDetailPage, trying static fallback:", error.message);
  }

  if (!job) {
    const mockJob = getJobById(id);
    if (mockJob) {
      job = { ...mockJob, _id: mockJob.id };
    }
  }

  if (!job) {
    return (
      <div className="mx-auto max-w-xl text-center py-20 px-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-red-50 text-red-500 font-extrabold text-2xl mx-auto mb-3 border border-red-100">
          ⚠️
        </span>
        <h1 className="text-xl font-bold text-foreground tracking-tight">Job Vacancy Not Found</h1>
        <p className="mt-1.5 text-xs text-muted">
          The job listing you are looking for might have expired, been removed, or does not exist.
        </p>
        <Link
          href="/jobs"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-secondary transition-all"
        >
          Back to all jobs
        </Link>
      </div>
    );
  }

  const postedDate = new Date(job.postedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const deadlineDate = job.deadline
    ? new Date(job.deadline).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    : "Open / Continuous";

  const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(
    `http://t.me/NewWorkInEthiopia_VacancyGroup`
  )}&text=${encodeURIComponent(
    `EthioWork vacancy: ${job.title} at ${job.company}. Click to see details.`
  )}`;

  return (
    <div className="w-full">
      {/* Ethiojobs Style Gradient Header Banner */}
      <div className="w-full bg-gradient-to-r from-primary to-secondary text-white py-12 px-4 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="mx-auto max-w-5xl relative z-10">
          <div className="mb-4">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-200 hover:text-white transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              All vacancies directory
            </Link>
          </div>
          <h1 className="text-2xl font-extrabold sm:text-4xl tracking-tight leading-tight">
            {job.title}
          </h1>
          <p className="text-sm font-semibold text-emerald-100 mt-1">{job.company}</p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Job Description and Requirements */}
          <div className="lg:col-span-2 space-y-6 bg-white p-6 sm:p-8 rounded-xl border border-border shadow-sm">
            <div>
              <h2 className="text-base font-extrabold text-foreground mb-2.5 pb-2 border-b border-border">
                Job Overview & Details
              </h2>
              <p className="text-xs text-muted leading-relaxed font-normal whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {job.responsibilities && job.responsibilities.length > 0 && (
              <div>
                <h2 className="text-base font-extrabold text-foreground mb-2.5">Key Duties & Responsibilities</h2>
                <ul className="space-y-1.5 list-disc pl-4 text-xs text-muted leading-relaxed">
                  {job.responsibilities.map((resp, idx) => (
                    <li key={idx}>
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.requirements && job.requirements.length > 0 && (
              <div>
                <h2 className="text-base font-extrabold text-foreground mb-2.5">Required Skills & Education</h2>
                <ul className="space-y-1.5 list-disc pl-4 text-xs text-muted leading-relaxed">
                  {job.requirements.map((req, idx) => (
                    <li key={idx}>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.benefits && job.benefits.length > 0 && (
              <div>
                <h2 className="text-base font-extrabold text-foreground mb-2.5">Benefits & Compensation</h2>
                <ul className="space-y-1.5 list-disc pl-4 text-xs text-muted leading-relaxed">
                  {job.benefits.map((benefit, idx) => (
                    <li key={idx}>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column: Structured Specifications Table */}
          <div className="space-y-6 lg:sticky lg:top-20">
            
            <div className="bg-white p-5 rounded-xl border border-border shadow-sm space-y-5">
              <h3 className="font-extrabold text-foreground text-sm pb-2.5 border-b border-border">
                Vacancy Specifications
              </h3>
              
              <div className="space-y-3.5">
                {/* Career Level */}
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted font-semibold">Career Level:</span>
                  <span className="font-bold text-foreground">{job.careerLevel || "Mid Level"}</span>
                </div>

                {/* Salary */}
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted font-semibold">Salary:</span>
                  <span className="font-bold text-primary">{job.salary}</span>
                </div>

                {/* Location */}
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted font-semibold">Location:</span>
                  <span className="font-bold text-foreground">{job.location}</span>
                </div>

                {/* Type */}
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted font-semibold">Job Type:</span>
                  <span className="font-bold text-foreground">{job.type}</span>
                </div>

                {/* Experience */}
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted font-semibold">Experience:</span>
                  <span className="font-bold text-foreground">{job.experience}</span>
                </div>

                {/* Date Posted */}
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted font-semibold">Posted Date:</span>
                  <span className="font-bold text-foreground">{postedDate}</span>
                </div>

                {/* Deadline */}
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted font-semibold text-red-600">Application Deadline:</span>
                  <span className="font-bold text-red-700">{deadlineDate}</span>
                </div>
              </div>

              {/* Apply Button */}
              <div className="pt-3 border-t border-border">
                <ApplyModal jobId={job._id || job.id} jobTitle={job.title} company={job.company} />
              </div>
            </div>

            {/* Social Share & Employer Details */}
            <div className="bg-foreground p-5 rounded-xl text-white relative overflow-hidden shadow">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 h-36 w-36 rounded-full bg-primary opacity-20 blur-xl"></div>
              
              <h4 className="font-bold text-sm mb-2 relative z-10">Share & Connect</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed mb-4 relative z-10">
                Encourage others or share this vacancy with your network. Directly post updates to your Telegram chat channels.
              </p>
              
              <div className="flex flex-col gap-2 relative z-10">
                {/* Share to Telegram Button */}
                <a
                  href={shareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex justify-center items-center gap-1.5 rounded-lg bg-accent py-2 text-xs font-bold text-white hover:bg-accent/90 transition-all cursor-pointer"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.53-1.39.51-.46-.01-1.35-.26-2.01-.48-.81-.27-1.46-.42-1.4-.88.03-.24.36-.49.99-.74 3.88-1.69 6.47-2.8 7.77-3.32 3.7-1.47 4.46-1.73 4.96-1.74.11 0 .36.03.52.16.14.11.18.26.2.42-.01.06-.01.12-.02.19z"/>
                  </svg>
                  Share on Telegram
                </a>

                {job.companyWebsite && (
                  <a
                    href={job.companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex justify-center items-center rounded-lg bg-white/10 py-2 text-xs font-bold text-white hover:bg-white/20 transition-all text-center"
                  >
                    Employer Website
                  </a>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
