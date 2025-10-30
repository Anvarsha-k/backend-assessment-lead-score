import mongoose from "mongoose";

// DataBase Connection Phase
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/lead_scoring");
    console.log("MongoDB connected");
  } catch (err) {
    console.error(" Database Connection failed", err.message);
    process.exit(1);
  }
};

export default connectDB;
