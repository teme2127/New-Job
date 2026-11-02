import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { hashPassword } from "@/lib/crypto";
import { body, text, email, json, failure, ApiError } from "@/lib/api";
export async function POST(request) {
  try {
    const data = await body(request);
    const name = text(data.name, "name");
    const address = email(data.email);
    text(data.password, "password", 1024);
    if (data.password.length < 6) throw new ApiError(400, "Password must contain at least 6 characters");
    if (!["candidate", "employer"].includes(data.role)) throw new ApiError(400, "Invalid role");
    await dbConnect();
    if (await User.findOne({ email: address })) throw new ApiError(409, "Email is already registered");
    const user = await User.create({ name, email: address, password: hashPassword(data.password), role: data.role });
    return json({ success: true, user: { id: String(user._id), name: user.name, email: user.email, role: user.role } }, 201);
  } catch (error) { return failure(error); }
}
