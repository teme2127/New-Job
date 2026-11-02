import { currentUser, json, failure } from "@/lib/api";
export async function GET(request) {
  try { return json({ user: await currentUser(request, false) }); }
  catch (error) { return failure(error); }
}
