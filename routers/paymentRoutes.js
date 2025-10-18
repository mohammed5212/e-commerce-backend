import express from "express";
const router = express.Router();
import { protect } from "../middleware/auth.js";
import{initiatePayment, getPaymentDetails} from "../controllers/paymentController.js"
// pay for an order
router.post("/", protect, initiatePayment);

// get payment details for an order
router.get("/:orderId", protect, getPaymentDetails);

export default router;