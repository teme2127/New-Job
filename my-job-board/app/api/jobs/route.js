// app/api/jobs/route.js
import dbConnect from "@/lib/mongodb";
import Job from "@/models/Job";
import { seedJobs } from "@/lib/seed";

export async function GET(request) {
  try {
    await dbConnect();
    await seedJobs(); // Seed data automatically if DB is empty
    const jobsList = await Job.find({}).sort({ postedAt: -1 });
    return new Response(JSON.stringify(jobsList), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("GET API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch jobs" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const jobData = await request.json();
    
    // Basic validation
    const requiredFields = ["title", "company", "location", "type", "category", "experience", "salary", "description"];
    for (const field of requiredFields) {
      if (!jobData[field]) {
        return new Response(JSON.stringify({ error: `Field '${field}' is required` }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    // Default icon if not provided
    const emojiMap = {
      Engineering: "💻",
      Design: "🎨",
      Product: "🚀",
      Marketing: "📈",
      Sales: "💰",
      Support: "🤝"
    };
    
    const category = jobData.category || "Engineering";
    const logo = emojiMap[category] || "💼";
    
    const colorBgMap = {
      Engineering: "bg-blue-100 text-blue-700",
      Design: "bg-purple-100 text-purple-700",
      Product: "bg-indigo-100 text-indigo-700",
      Marketing: "bg-emerald-100 text-emerald-700",
      Sales: "bg-yellow-100 text-yellow-800",
      Support: "bg-orange-100 text-orange-700"
    };
    
    const logoBg = colorBgMap[category] || "bg-gray-100 text-gray-700";

    const parsedJob = {
      ...jobData,
      logo,
      logoBg,
      tags: jobData.tags ? (typeof jobData.tags === "string" ? jobData.tags.split(",").map(t => t.trim()).filter(t => t.length > 0) : jobData.tags) : [],
      responsibilities: jobData.responsibilities ? (typeof jobData.responsibilities === "string" ? jobData.responsibilities.split("\n").map(r => r.trim()).filter(r => r.length > 0) : jobData.responsibilities) : [],
      requirements: jobData.requirements ? (typeof jobData.requirements === "string" ? jobData.requirements.split("\n").map(req => req.trim()).filter(req => req.length > 0) : jobData.requirements) : [],
      benefits: jobData.benefits ? (typeof jobData.benefits === "string" ? jobData.benefits.split("\n").map(b => b.trim()).filter(b => b.length > 0) : jobData.benefits) : [],
      postedAt: new Date().toISOString()
    };

    const newJob = await Job.create(parsedJob);

    return new Response(JSON.stringify(newJob), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("POST API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to create job" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
