import dbConnect from "@/lib/mongodb";
import Job from "@/models/Job";
import { seedJobs } from "@/lib/seed";
import { body, text, email, currentUser, json, failure, ApiError } from "@/lib/api";
export async function GET() {
  try {
    await dbConnect();
    await seedJobs();
    return json(await Job.find({}).sort({ postedAt: -1 }));
  } catch (error) { return failure(error); }
}
export async function POST(request) {
  try {
    const data = await body(request);
    const user = await currentUser(request, true, "employer");
    const job = {};
    for (const field of ["title", "company", "location", "type", "category", "experience", "salary", "description"]) {
      job[field] = text(data[field], field, field === "description" ? 20000 : 200);
    }
    if (!["Full-time", "Part-time", "Contract", "Remote", "Internship"].includes(job.type)) throw new ApiError(400, "Invalid job type");
    job.companyEmail = email(data.companyEmail);
    job.companyWebsite = text(data.companyWebsite, "company website", 2000, false);
    if (job.companyWebsite) {
      let url;
      try { url = new URL(job.companyWebsite); } catch { throw new ApiError(400, "Invalid company website"); }
      if (!["https:", "http:"].includes(url.protocol)) throw new ApiError(400, "Invalid company website");
    }
    if (data.deadline) {
      const date = new Date(data.deadline);
      if (!Number.isFinite(date.getTime()) || date.getTime() <= Date.now()) throw new ApiError(400, "Deadline must be in the future");
      job.deadline = date;
    }
    job.careerLevel = text(data.careerLevel, "career level", 200, false) || "Mid Level";
    for (const field of ["tags", "responsibilities", "requirements", "benefits"]) {
      const value = data[field] || [];
      const list = typeof value === "string" ? value.split(field === "tags" ? "," : "\n").filter(s => s.trim()) : value;
      if (!Array.isArray(list) || list.length > 100) throw new ApiError(400, `Invalid ${field}`);
      job[field] = list.map(s => text(s, field, 2000));
    }
    job.postedBy = user.id;
    job.postedAt = new Date();
    return json(await Job.create(job), 201);
  } catch (error) { return failure(error); }
}
