import express from "express";
import { register, login, logout, getMe, updateMe, selectWorkspace } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authMiddleware, getMe);
router.patch("/me", authMiddleware, updateMe);
router.post("/select-workspace", authMiddleware, selectWorkspace);


export default router;