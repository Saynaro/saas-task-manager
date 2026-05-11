import express from "express";
import { getWorkspaceMembers } from "../controllers/workspaceController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/members", getWorkspaceMembers);

export default router;