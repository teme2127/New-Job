// models/Application.js
import mongoose from "mongoose";
import { getModel } from "@/lib/mockDb";

const ApplicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: [true, "Job ID reference is required"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Optional for guest applications, but useful for registered users
    },
    name: {
      type: String,
      required: [true, "Applicant name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Applicant email is required"],
      lowercase: true,
      trim: true,
    },
    cvText: {
      type: String,
      required: [true, "Resume details/cover letter is required"],
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "shortlisted", "rejected"],
      default: "pending",
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const RealApplication = mongoose.models.Application || mongoose.model("Application", ApplicationSchema);
export default getModel("Application", RealApplication);
