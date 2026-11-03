import crypto from "node:crypto";
import { ServiceError } from "./serviceError";
export const SESSION_SECONDS = 7 * 24 * 60 * 60;
function sessionKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new ServiceError("SESSION_CONFIGURATION", "SESSION_SECRET must contain at least 32 characters");
  return crypto.createHash("sha256").update(secret).digest();
}
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  return `${salt}:${crypto.scryptSync(password, salt, 64).toString("hex")}`;
}
export function verifyPassword(password, storedPassword) {
  if (typeof password !== "string" || typeof storedPassword !== "string") return false;
  const [salt, hash] = storedPassword.split(":");
  if (!salt || !/^[a-f0-9]{128}$/.test(hash || "")) return false;
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), crypto.scryptSync(password, salt, 64));
}
export function encryptSession(payload) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", sessionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify({ ...payload, exp: Date.now() + SESSION_SECONDS * 1000 })), cipher.final()]);
  return [iv, encrypted, cipher.getAuthTag()].map(b => b.toString("base64url")).join(".");
}
export function decryptSession(token) {
  const key = sessionKey();
  try {
    if (typeof token !== "string" || token.length > 4096) return null;
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [iv, encrypted, tag] = parts.map(s => Buffer.from(s, "base64url"));
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);
    const payload = JSON.parse(Buffer.concat([decipher.update(encrypted), decipher.final()]).toString());
    return typeof payload.exp === "number" && payload.exp > Date.now() && /^[a-f0-9]{24}$/.test(payload.id) ? payload : null;
  } catch { return null; }
}
