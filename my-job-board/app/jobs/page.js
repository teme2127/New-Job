// app/jobs/page.js
import dbConnect from "@/lib/mongodb";
import Job from "@/models/Job";
import { seedJobs } from "@/lib/seed";
import { getJobs } from "@/lib/jobsData";
import JobsSearchPortal from "@/components/JobsSearchPortal";

export const metadata = {
  title: "Search Vacancies | EthioWork",
  description: "Browse verified job vacancies in Ethiopia including NGOs, banks, healthcare, and trading sectors with split screen Master-Detail details.",
};

export default async function JobsPage() {
  let initialJobs = [];

  try {
    await dbConnect();
    await seedJobs();
    const dbJobs = await Job.find({}).sort({ postedAt: -1 });
    initialJobs = JSON.parse(JSON.stringify(dbJobs));
  } catch (error) {
    console.warn("MongoDB connection failed on JobsPage, using static fallback:", error.message);
    const fallbackJobs = getJobs();
    initialJobs = fallbackJobs.map(j => ({ ...j, _id: j.id }));
  }

  return (
    <div className="w-full bg-slate-50 min-h-screen">
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-8 px-4 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="mx-auto max-w-7xl relative z-10">
          <h1 className="text-xl font-extrabold sm:text-3xl tracking-tight leading-tight">
            EthioWork Careers Directory
          </h1>
          <p className="text-xs text-emerald-100 mt-1">
            Browse verified opportunities in NGO, healthcare, finance, distribution, and agriculture sectors in Ethiopia.
          </p>
        </div>
      </div>
      
      <JobsSearchPortal initialJobs={initialJobs} />
    </div>
  );
}
