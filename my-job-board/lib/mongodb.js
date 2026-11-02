import mongoose from "mongoose";
const cached = global.mongoose || (global.mongoose = { conn: null, promise: null });
export default async function dbConnect() {
  // File storage is explicitly enabled for local development only.
  global.useMockDb = process.env.USE_MOCK_DB === "true" && process.env.NODE_ENV !== "production";
  if (global.useMockDb) return { isMock: true };
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes("<db_password>")) throw new Error("Configure a valid MONGODB_URI");
  if (cached.conn) return cached.conn;
  if (!cached.promise) cached.promise = mongoose.connect(uri, { bufferCommands: false, serverSelectionTimeoutMS: 5000 });
  try { cached.conn = await cached.promise; return cached.conn; }
  catch (error) { cached.promise = null; throw error; }
}
