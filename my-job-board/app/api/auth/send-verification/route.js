import { json } from "@/lib/api";
export async function GET() {
  return json({ error: "Email verification is not configured. Sign in with your registered account." }, 501);
}
