import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import authRoutes from "./routers/authRoutes.js";
import orderRoutes from "./routers/orderRoutes.js";
import connectDB from "./config/db.js";
connectDB();
import userRoutes from "./routers/userRoutes.js";
import productRoutes from "./routers/productRoutes.js";
import categoryRoutes from "./routers/categoryRoutes.js";
import cartRoutes from "./routers/cartRoutes.js";
import paymentRoutes from "./routers/paymentRoutes.js";
const app = express(); 


// Middleware 
// Allow your frontend + localhost (for local dev)
app.use(cors({
  origin: [
    "https://e-commerce-frontend-silk-eta.vercel.app", // live frontend
    "http://localhost:5173" // local frontend for development
  ],
  credentials: true // allow cookies/auth headers
}));

 app.use(express.json()); // 
// Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/products", productRoutes); 
  app.use("/api/orders", orderRoutes); 
  app.use("/api/categories", categoryRoutes);
  app.use("/api/cart", cartRoutes);        // All cart-related endpoints
app.use("/api/payment", paymentRoutes);  // All payment-related endpoints
// // Example root
  app.get("/", (req, res) => {
 res.send("API is running..."); 
 });
 
 export default  app;