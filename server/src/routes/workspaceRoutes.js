import express from "express";
import { getWorkspaceMembers, updateWorkspace, removeMember, createWorkspace, getWorkspaceActivity } from "../controllers/workspaceController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { uploadAvatar } from "../config/multer.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/members", getWorkspaceMembers);
router.get("/activity", getWorkspaceActivity);
router.post("/", uploadAvatar.single("avatar"), createWorkspace);
router.patch("/update", uploadAvatar.single("avatar"), updateWorkspace);
router.delete("/members/:userId", removeMember);

export default router;
