import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    paymentMethod: { type: String, enum: ["card", "paypal", "upi", "cod"], required: true },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
    amount: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
    transactionId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);