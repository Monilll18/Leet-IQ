import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import {
    getStats,
    getAllUsers,
    banUser,
    unbanUser,
    deleteUser,
    getAllContests,
    createContest,
    updateContest,
    deleteContest,
    getAllProblems,
    createProblem,
    updateProblem,
    deleteProblem,
    getAllSessions,
    deleteSession,
    getAllAppeals,
    approveAppeal,
    rejectAppeal,
} from "../controllers/adminController.js";
import {
    createProduct,
    updateProduct,
    deleteProduct,
    getAllOrders,
    updateOrderStatus,
    getProducts
} from "../controllers/storeController.js";

const router = express.Router();

// All admin routes require authentication + admin role
router.use(protectRoute);
router.use(requireAdmin);

// Statistics
router.get("/stats", getStats);

// User management
router.get("/users", getAllUsers);
router.post("/users/:userId/ban", banUser);
router.post("/users/:userId/unban", unbanUser);
router.delete("/users/:userId", deleteUser);

// Contest management
router.get("/contests", getAllContests);
router.post("/contests", createContest);
router.put("/contests/:contestId", updateContest);
router.delete("/contests/:contestId", deleteContest);

// Problem management
router.get("/problems", getAllProblems);
router.post("/problems", createProblem);
router.put("/problems/:id", updateProblem);
router.delete("/problems/:id", deleteProblem);

// Session management
router.get("/sessions", getAllSessions);
router.delete("/sessions/:sessionId", deleteSession);

// Ban appeal management
router.get("/appeals", getAllAppeals);
router.post("/appeals/:appealId/approve", approveAppeal);
router.post("/appeals/:appealId/reject", rejectAppeal);

// Store management
router.get("/store/products", getProducts);
router.post("/store/products", createProduct);
router.put("/store/products/:id", updateProduct);
router.delete("/store/products/:id", deleteProduct);
router.get("/store/orders", getAllOrders);
router.put("/store/orders/:id", updateOrderStatus);

export default router;

