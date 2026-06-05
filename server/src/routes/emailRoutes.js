import express from "express";
import { verifyEmail, forgotPassword, resetPassword, resendVerificationEmail } from "../controllers/emailController.js";
import { forgotPasswordLimiter, resetPasswordLimiter, verifyEmailLimiter, resendVerificationLimiter } from "../middlewares/rateLimiter.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/verify-email", verifyEmailLimiter, verifyEmail);
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/reset-password", resetPasswordLimiter, resetPassword);
router.post("/resend-verification", authMiddleware, resendVerificationLimiter, resendVerificationEmail);

export default router;