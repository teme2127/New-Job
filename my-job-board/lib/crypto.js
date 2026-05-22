// lib/crypto.js
import crypto from "crypto";

// Hash a password using scryptSync and a generated salt
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

// Verify password matches stored hashed version
export function verifyPassword(password, storedPassword) {
  if (!storedPassword || !storedPassword.includes(":")) return false;
  const [salt, hash] = storedPassword.split(":");
  const verifyHash = crypto.scryptSync(password, salt, 64).toString("hex");
  return hash === verifyHash;
}

// Encrypt user session payload using aes-256-cbc
const SECRET_KEY = process.env.SESSION_SECRET || "ethiojobs-super-secret-key-session-2026";
export function encryptSession(payload) {
  try {
    const data = JSON.stringify(payload);
    const key = crypto.scryptSync(SECRET_KEY, "salt", 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");
    return `${iv.toString("hex")}:${encrypted}`;
  } catch (error) {
    console.error("Encryption failed:", error);
    return "";
  }
}

// Decrypt session cookie string
export function decryptSession(sessionStr) {
  try {
    if (!sessionStr) return null;
    const parts = sessionStr.split(":");
    if (parts.length !== 2) return null;
    const [ivHex, encryptedHex] = parts;
    const key = crypto.scryptSync(SECRET_KEY, "salt", 32);
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return JSON.parse(decrypted);
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
}
