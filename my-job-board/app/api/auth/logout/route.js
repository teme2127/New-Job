import { body, json, failure, sessionCookie } from "@/lib/api";
export async function POST(request) {
  try {
    const origin = request.headers.get("origin");
    if (origin) await body(new Request(request.url, { method: "POST", headers: { origin }, body: "{}" }));
    return json({ success: true }, 200, { "Set-Cookie": sessionCookie("", 0) });
  } catch (error) { return failure(error); }
}
