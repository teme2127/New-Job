// app/api/auth/signup/route.js
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { hashPassword } from "@/lib/crypto";

export async function POST(request) {
  try {
    await dbConnect();
    const { name, email, password, role } = await request.json();

    if (!name || !email || !password || !role) {
      return new Response(JSON.stringify({ error: "All fields are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (role !== "candidate" && role !== "employer") {
      return new Response(JSON.stringify({ error: "Invalid role specified" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "Email is already registered" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Hash password and save user
    const hashedPassword = hashPassword(password);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return new Response(
      JSON.stringify({
        success: true,
        user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return new Response(JSON.stringify({ error: "Failed to register user" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
