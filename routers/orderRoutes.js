import express from "express";
const router = express.Router();
import {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteOrder
} from "../controllers/orderController.js";

import { protect, authorize } from "../middleware/auth.js";

// USER ROUTES

// Create a new order (logged-in user)
router.post("/", protect, createOrder);

// Get logged-in user's order history
router.get("/my", protect, getUserOrders);

// Get single order by ID (must be logged in)
router.get("/:id", protect, getOrderById);

// ADMIN ROUTES

// Get all orders (Admin only)
router.get("/", protect, authorize ("admin"), getAllOrders);

// Update order status (Admin only)
router.put("/:id/status", protect, authorize ("admin"), updateOrderStatus);

// Delete an order (Admin only)
router.delete("/:id", protect,authorize ("admin"), deleteOrder);

export default router;