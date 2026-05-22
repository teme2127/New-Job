// app/api/auth/me/route.js
import { decryptSession } from "@/lib/crypto";

export async function GET(request) {
  try {
    const cookiesHeader = request.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
      cookiesHeader.split(";").map((c) => c.trim().split("="))
    );

    const sessionToken = cookies["session"];
    if (!sessionToken) {
      return new Response(JSON.stringify({ user: null }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const payload = decryptSession(sessionToken);
    if (!payload) {
      return new Response(JSON.stringify({ user: null }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ user: payload }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Auth session fetch error:", error);
    return new Response(JSON.stringify({ user: null }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}
