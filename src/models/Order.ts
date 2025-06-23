// src/models/Order.ts
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  address: String,
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
    },
  ],
  paid: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
