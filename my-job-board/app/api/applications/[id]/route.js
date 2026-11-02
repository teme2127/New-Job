import Application from "@/models/Application";
import Job from "@/models/Job";
import { body, objectId, currentUser, json, failure, ApiError } from "@/lib/api";
export async function PATCH(request, { params }) {
  try {
    const data = await body(request);
    const user = await currentUser(request, true, "employer");
    const id = objectId((await params).id);
    if (!["pending", "reviewed", "shortlisted", "rejected"].includes(data.status)) throw new ApiError(400, "Invalid status");
    const application = await Application.findById(id);
    if (!application) throw new ApiError(404, "Application not found");
    const job = await Job.findById(application.jobId);
    if (!job || String(job.postedBy) !== user.id) throw new ApiError(403, "This application belongs to another employer");
    const updated = await Application.findByIdAndUpdate(id, { status: data.status }, { new: true, runValidators: true });
    return json({ success: true, application: updated });
  } catch (error) { return failure(error); }
}
