import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Connect MongoDB and start server
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log(" MongoDB connected");
    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(" MongoDB connection error:", err.message);
    process.exit(1);
  });