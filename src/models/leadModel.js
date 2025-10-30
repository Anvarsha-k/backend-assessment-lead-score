import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
  name: String,
  role: String,
  company: String,
  industry: String,
  location: String,
  linkedin_bio: String,
  score: Number,
  intent: String,
  reasoning: String,
}, { timestamps: true });

export default mongoose.model("Lead", leadSchema);
