import express from "express";
import { register, login, logout, getMe, updateMe } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authMiddleware, getMe);
router.patch("/me", authMiddleware, updateMe);


export default router;