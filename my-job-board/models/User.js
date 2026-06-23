import mongoose from "mongoose";
import { getModel } from "@/lib/mockDb";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ["candidate", "employer"],
      default: "candidate",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Prevent compiling model query conflicts on Hot Reload
const RealUser = mongoose.models.User || mongoose.model("User", UserSchema);
export default getModel("User", RealUser);
