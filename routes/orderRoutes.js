import express from "express";
import { placeOrder, createPayment, getUserOrders, getOrderById } from "../controllers/orderController.js";
import { upload } from "../middleware/upload.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/place", authenticateToken, upload.array("files", 10), placeOrder);
router.post("/payment", authenticateToken, createPayment);
router.get("/user/:userId", authenticateToken, getUserOrders);
router.get("/:orderId", authenticateToken, getOrderById);

export default router;
