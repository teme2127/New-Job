// app/api/applications/route.js
import dbConnect from "@/lib/mongodb";
import Application from "@/models/Application";
import Job from "@/models/Job"; // Import to register the schema
import { decryptSession } from "@/lib/crypto";

export async function POST(request) {
  try {
    await dbConnect();
    const { jobId, name, email, cvText } = await request.json();

    if (!jobId || !name || !email || !cvText) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Try to get logged-in user
    const cookiesHeader = request.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
      cookiesHeader.split(";").map((c) => c.trim().split("="))
    );
    const sessionToken = cookies["session"];
    let userId = null;
    if (sessionToken) {
      const payload = decryptSession(sessionToken);
      if (payload) userId = payload.id;
    }

    const application = await Application.create({
      jobId,
      userId,
      name,
      email,
      cvText,
      status: "pending",
    });

    return new Response(JSON.stringify({ success: true, application }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Apply error:", error);
    return new Response(JSON.stringify({ error: "Failed to submit application" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET(request) {
  try {
    await dbConnect();

    // Parse session cookie
    const cookiesHeader = request.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
      cookiesHeader.split(";").map((c) => c.trim().split("="))
    );
    const sessionToken = cookies["session"];
    if (!sessionToken) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const payload = decryptSession(sessionToken);
    if (!payload) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (payload.role === "candidate") {
      // Find applications submitted by this candidate, populating Job info
      const apps = await Application.find({ userId: payload.id })
        .populate("jobId")
        .sort({ appliedAt: -1 });

      return new Response(JSON.stringify(apps), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else if (payload.role === "employer") {
      // Find all jobs posted by this employer
      const employerJobs = await Job.find({ postedBy: payload.id });
      const jobIds = employerJobs.map((j) => j._id);

      // Find applications for these jobs
      const apps = await Application.find({ jobId: { $in: jobIds } })
        .populate("jobId")
        .sort({ appliedAt: -1 });

      return new Response(JSON.stringify(apps), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid role" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Fetch applications error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch applications" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
