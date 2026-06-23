// lib/mongodb.js
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (global.useMockDb) {
    return { isMock: true };
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (MONGODB_URI.includes("<db_password>")) {
    console.warn("MongoDB connection URI contains placeholder <db_password>. Switching to local mock database.");
    global.useMockDb = true;
    return { isMock: true };
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 3000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.warn("MongoDB connection failed, falling back to local mock database:", e.message);
    global.useMockDb = true;
    return { isMock: true };
  }

  return cached.conn;
}

export default dbConnect;
