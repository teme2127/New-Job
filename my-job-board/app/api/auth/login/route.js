// app/api/auth/login/route.js
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { verifyPassword, encryptSession } from "@/lib/crypto";

export async function POST(request) {
  try {
    await dbConnect();
    const { email, password } = await request.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Email and password are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ error: "Invalid email or password" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const isValid = verifyPassword(password, user.password);
    if (!isValid) {
      return new Response(JSON.stringify({ error: "Invalid email or password" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Encrypt session payload
    const sessionToken = encryptSession({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    // Set secure HTTP-only cookie manually in Headers
    const cookieString = `session=${sessionToken}; Path=/; HttpOnly; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax`;

    return new Response(
      JSON.stringify({
        success: true,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": cookieString,
        },
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    return new Response(JSON.stringify({ error: "Failed to log in" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
