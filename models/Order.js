import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId, ref: "User", // reference to User model
      required: true
    },
    shippingAddress: {
      type: Object,  required: true
    },
    orderDate: {
      type: Date, default: Date.now
    },
    status: {
      type: String,  enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
      default: "pending"
    },
    totalAmount: {
      type: Number, required: true
    },
    paymentInfo: {
  method: { type: String },
  paymentId: { type: String },
  paidAt: { type: Date }
}
  },
  { timestamps: true }
);



export default mongoose.model("Order", orderSchema);