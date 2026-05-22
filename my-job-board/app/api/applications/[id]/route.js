// app/api/applications/[id]/route.js
import dbConnect from "@/lib/mongodb";
import Application from "@/models/Application";
import { decryptSession } from "@/lib/crypto";

export async function PATCH(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const { status } = await request.json();

    if (!status || !["pending", "reviewed", "shortlisted", "rejected"].includes(status)) {
      return new Response(JSON.stringify({ error: "Invalid status value" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Verify cookies and role
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
    if (!payload || payload.role !== "employer") {
      return new Response(JSON.stringify({ error: "Only employers can modify applications" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const updatedApp = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedApp) {
      return new Response(JSON.stringify({ error: "Application not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, application: updatedApp }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Update application error:", error);
    return new Response(JSON.stringify({ error: "Failed to update application" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
