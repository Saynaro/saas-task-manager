import express from "express";
import { verifyEmail, forgotPassword, resetPassword } from "../controllers/emailController.js";

const router = express.Router();

router.get("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;