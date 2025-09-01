import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB, { checkDBHealth } from "./config/db.js";
import orderRoutes from "./routes/orderRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// File serving (for uploaded docs)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check endpoint
app.get("/api/health", (req, res) => {
  const dbHealth = checkDBHealth();
  const serverStatus = {
    status: "running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbHealth,
    environment: process.env.NODE_ENV || "development"
  };
  
  console.log("🏥 Health check requested:", serverStatus);
  res.json(serverStatus);
});

// Routes
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);

// MongoDB connection
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Health check available at: http://localhost:${PORT}/api/health`);
    });
  })
  .catch((err) => console.error("Server startup error:", err));

  // Default route
app.get("/", (req, res) => {
  res.send("✅ PrintSaarthi Backend is Running!");
});
