import dbConnect from "@/lib/mongodb";
import Application from "@/models/Application";
import Job from "@/models/Job";
import { body, text, email, objectId, currentUser, json, failure, ApiError } from "@/lib/api";
export async function POST(request) {
  try {
    const data = await body(request);
    const jobId = objectId(data.jobId);
    const name = text(data.name, "name");
    const address = email(data.email);
    const cvText = text(data.cvText, "resume", 50000);
    await dbConnect();
    const user = await currentUser(request, false);
    if (user && user.role !== "candidate") throw new ApiError(403, "Only candidates can apply");
    const job = await Job.findById(jobId);
    if (!job) throw new ApiError(404, "Job not found");
    if (job.deadline && new Date(job.deadline).getTime() <= Date.now()) throw new ApiError(400, "Applications for this job are closed");
    if (await Application.findOne({ jobId, email: address })) throw new ApiError(409, "You have already applied for this job");
    const application = await Application.create({ jobId, userId: user?.id || null, name, email: address, cvText, status: "pending", appliedAt: new Date() });
    return json({ success: true, application }, 201);
  } catch (error) { return failure(error); }
}
export async function GET(request) {
  try {
    const user = await currentUser(request);
    let filter;
    if (user.role === "candidate") filter = { userId: user.id };
    else {
      const jobs = await Job.find({ postedBy: user.id });
      filter = { jobId: { $in: jobs.map(j => j._id) } };
    }
    return json(await Application.find(filter).populate("jobId").sort({ appliedAt: -1 }));
  } catch (error) { return failure(error); }
}
