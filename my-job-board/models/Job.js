// models/Job.js
import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Job title is required"],
    trim: true,
  },
  company: {
    type: String,
    required: [true, "Company name is required"],
    trim: true,
  },
  logo: {
    type: String,
    default: "💼",
  },
  logoBg: {
    type: String,
    default: "bg-slate-100 text-slate-700",
  },
  location: {
    type: String,
    required: [true, "Job location is required"],
    trim: true,
  },
  type: {
    type: String,
    required: [true, "Job type is required"],
    enum: ["Full-time", "Part-time", "Contract", "Remote", "Internship"],
  },
  category: {
    type: String,
    required: [true, "Job category is required"],
    // A flexible string rather than a strict enum so employers have freedom, 
    // but default options like NGO, Banking, Healthcare, IT, Engineering, Accounting are shown in selector UI.
  },
  experience: {
    type: String,
    required: [true, "Experience level is required"],
  },
  salary: {
    type: String,
    required: [true, "Salary range is required"],
  },
  postedAt: {
    type: Date,
    default: Date.now,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false, // Optional for initial seeder data
  },
  deadline: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days from now
  },
  careerLevel: {
    type: String,
    default: "Mid Level", // Junior, Mid, Senior, Management
  },
  tags: {
    type: [String],
    default: [],
  },
  description: {
    type: String,
    required: [true, "Job description is required"],
  },
  responsibilities: {
    type: [String],
    default: [],
  },
  requirements: {
    type: [String],
    default: [],
  },
  benefits: {
    type: [String],
    default: [],
  },
  companyWebsite: {
    type: String,
    trim: true,
  },
  companyEmail: {
    type: String,
    required: [true, "Company contact email is required"],
    trim: true,
  },
});

export default mongoose.models.Job || mongoose.model("Job", JobSchema);
