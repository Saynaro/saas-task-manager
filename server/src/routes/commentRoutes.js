import express from "express";
import { getProjectComments, createComment } from "../controllers/commentController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router({ mergeParams: true });


router.get("/", authMiddleware, getProjectComments);
router.post("/", authMiddleware, createComment);

export default router;