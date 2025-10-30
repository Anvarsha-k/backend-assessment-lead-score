import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
  name: String,
  value_props: [String],
  ideal_use_cases: [String],
}, { timestamps: true });

export default mongoose.model("Offer", offerSchema);
