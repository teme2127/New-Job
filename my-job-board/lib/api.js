import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { decryptSession, SESSION_SECONDS } from "@/lib/crypto";
import { serviceFailure } from "./serviceError";
export class ApiError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
export const json = (data, status = 200, headers = {}) => Response.json(data, { status, headers: { "Cache-Control": "no-store", ...headers } });
export function failure(error) {
  if (error instanceof ApiError) return json({ error: error.message }, error.status);
  if (error.code === 11000) return json({ error: "A record with these details already exists" }, 409);
  if (error.name === "ValidationError" || error.name === "CastError") return json({ error: "Invalid field values" }, 400);
  const result = serviceFailure(error);
  console.error("API failure:", result.code);
  return json(result, 503);
}
export async function body(request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) throw new ApiError(403, "Invalid request origin");
  const raw = await request.text();
  if (Buffer.byteLength(raw) > 100000) throw new ApiError(413, "Request is too large");
  try {
    const value = JSON.parse(raw);
    if (!value || Array.isArray(value) || typeof value !== "object") throw new Error();
    return value;
  } catch { throw new ApiError(400, "Invalid JSON body"); }
}
export function text(value, field, max = 200, required = true) {
  if (!required && (value === undefined || value === "")) return "";
  if (typeof value !== "string" || !value.trim() || value.length > max) throw new ApiError(400, `Invalid ${field}`);
  return value.trim();
}
export function email(value) {
  const result = text(value, "email", 254).toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(result)) throw new ApiError(400, "Invalid email address");
  return result;
}
export function objectId(value) {
  if (typeof value !== "string" || !/^[a-f0-9]{24}$/i.test(value)) throw new ApiError(400, "Invalid ID");
  return value;
}
export function sessionCookie(token, seconds = SESSION_SECONDS) {
  return `session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${seconds}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
}
export async function currentUser(request, required = true, role) {
  const token = (request.headers.get("cookie") || "").split(";").map(s => s.trim()).find(s => s.startsWith("session="))?.slice(8);
  const payload = token ? decryptSession(token) : null;
  if (!payload) {
    if (required) throw new ApiError(401, "Please sign in");
    return null;
  }
  await dbConnect();
  const user = await User.findById(payload.id);
  if (!user) throw new ApiError(401, "Please sign in again");
  if (role && user.role !== role) throw new ApiError(403, `Only ${role}s can perform this action`);
  return { id: String(user._id), name: user.name, email: user.email, role: user.role };
}
