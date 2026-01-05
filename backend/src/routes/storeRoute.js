import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
    getProducts,
    getProductById,
    redeemProduct,
    getUserOrders,
    getOrderById
} from "../controllers/storeController.js";

const router = express.Router();

// Public routes
router.get("/products", getProducts);
router.get("/products/:id", getProductById);

// Protected routes (require login)
router.post("/redeem/:productId", protectRoute, redeemProduct);
router.get("/orders", protectRoute, getUserOrders);
router.get("/orders/:id", protectRoute, getOrderById);

export default router;
