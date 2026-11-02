import dbConnect from "@/lib/mongodb";
import Job from "@/models/Job";
import { presentJob } from "@/lib/jobPresentation";
import { seedJobs } from "@/lib/seed";
import JobsSearchPortal from "@/components/JobsSearchPortal";
export const dynamic = "force-dynamic";
export const metadata = { title: "Find your next opportunity | EthioWork", description: "Explore opportunities across Ethiopia. Search by role, company, sector, and location." };
export default async function JobsPage({ searchParams }) {
  const params = await searchParams;
  let jobs = [], loadError = false;
  try { await dbConnect(); await seedJobs(); jobs = (await Job.find({}).sort({ postedAt: -1 })).map(presentJob); }
  catch { loadError = true; }
  return <><section className="page-heading"><div className="container-wide"><p className="eyebrow">POSSIBILITIES START HERE</p><h1>Find work that moves you.</h1><p>A new role. A fresh perspective. Your next opportunity in Ethiopia.</p></div></section>{loadError && <div className="container-wide mt-6"><p role="alert" className="notice notice-error">We couldn’t load vacancies. Please try again later.</p></div>}<JobsSearchPortal key={`${params.q || ""}:${params.category || ""}`} initialJobs={jobs} initialQuery={typeof params.q === "string" ? params.q : ""} initialCategory={typeof params.category === "string" ? params.category : ""} /></>;
}
