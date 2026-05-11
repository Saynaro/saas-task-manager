import express from "express";
import { getWorkspaceMembers, updateWorkspace, removeMember, createWorkspace } from "../controllers/workspaceController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/members", getWorkspaceMembers);
router.post("/", createWorkspace);
router.patch("/update", updateWorkspace);
router.delete("/members/:userId", removeMember);

export default router;
