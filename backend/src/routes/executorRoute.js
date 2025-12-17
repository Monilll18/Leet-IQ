import express from "express";
import { executeSubmission } from "../controllers/executorController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/", protectRoute, executeSubmission);

export default router;
