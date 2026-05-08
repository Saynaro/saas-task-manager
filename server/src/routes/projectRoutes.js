import express from "express";
import { createProjectWithAllDetails, getProjects, updateProject, deleteProject } from "../controllers/projectController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createProjectWithAllDetails);
router.get("/", authMiddleware, getProjects);
router.patch("/:id", authMiddleware, updateProject);
router.delete("/:id", authMiddleware, deleteProject);

export default router;
