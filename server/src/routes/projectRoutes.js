import express from "express";
import { createProjectWithAllDetails, getProjects, updateProject } from "../controllers/projectController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createProjectWithAllDetails);
router.get("/", authMiddleware, getProjects);
router.patch("/:id", authMiddleware, updateProject);

export default router;
