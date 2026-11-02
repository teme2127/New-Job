import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { verifyPassword, encryptSession } from "@/lib/crypto";
import { body, text, email, json, failure, ApiError, sessionCookie } from "@/lib/api";
export async function POST(request) {
  try {
    const data = await body(request);
    const address = email(data.email);
    text(data.password, "password", 1024);
    await dbConnect();
    const user = await User.findOne({ email: address });
    if (!user || !verifyPassword(data.password, user.password)) throw new ApiError(401, "Invalid email or password");
    const safeUser = { id: String(user._id), name: user.name, email: user.email, role: user.role };
    return json({ success: true, user: safeUser }, 200, { "Set-Cookie": sessionCookie(encryptSession({ id: safeUser.id })) });
  } catch (error) { return failure(error); }
}
