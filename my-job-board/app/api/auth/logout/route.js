// app/api/auth/logout/route.js
export async function POST() {
  const cookieString = "session=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax";
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": cookieString,
    },
  });
}
