import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  shopkeeper: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  files: [{
    name: String,
    size: Number,
    type: String,
    url: String
  }],
  specifications: {
    paperSize: { type: String, default: 'A4' },
    paperType: { type: String, default: 'glossy' },
    quantity: { type: Number, default: 1 },
    color: { type: String, default: 'color' },
    binding: { type: String, default: 'none' },
    specialInstructions: String
  },
  status: { type: String, enum: ["pending", "processing", "completed", "cancelled"], default: "pending" },
  amount: Number,
  paymentStatus: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
  paymentMethod: String,
  deliveryAddress: String,
  contactNumber: String,
  orderDate: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
