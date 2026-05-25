import express from "express";
import { verifyEmail, forgotPassword, resetPassword, resendVerificationEmail } from "../controllers/emailController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/resend-verification", authMiddleware, resendVerificationEmail);

export default router;