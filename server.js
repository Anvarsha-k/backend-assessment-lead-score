import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import app from "./src/app.js"; 

dotenv.config();

app.use(express.json());

// db c0nnection
connectDB();

app.get("/", (req, res) => {
  res.send("MongoDB Connected Successfully");
});

connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
