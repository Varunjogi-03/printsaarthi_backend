import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  role: { type: String, enum: ["customer", "shopkeeper"], default: "customer" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);
