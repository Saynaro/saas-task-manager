import express from "express";
import { getGlobalStats, deleteWorkspace } from "../controllers/adminController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/stats", getGlobalStats);
router.delete("/workspaces/:id", deleteWorkspace);

export default router;
