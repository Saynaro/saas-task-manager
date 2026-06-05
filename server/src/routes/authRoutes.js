import express from "express";
import passport from "../config/passport.js";
import { register, login, logout, getMe, updateMe, selectWorkspace, refresh, changePassword, googleCallback } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { loginLimiter, registerLimiter, changePasswordLimiter, refreshLimiter } from "../middlewares/rateLimiter.js";
import { uploadAvatar } from "../config/multer.js";


const router = express.Router();

router.post("/register", registerLimiter, register);
router.post("/login", loginLimiter, login);
router.post("/logout", logout);
router.get("/me", authMiddleware, getMe);
router.patch("/me", authMiddleware, uploadAvatar.single("avatar"), updateMe);
router.post("/select-workspace", authMiddleware, selectWorkspace);
router.post("/change-password", authMiddleware, changePasswordLimiter, changePassword);
router.post("/refresh", refreshLimiter, refresh);

// google oauth redirect
router.get("/google", passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
}));

// google oauth callback
router.get("/google/callback",
    passport.authenticate("google", {
        failureRedirect: `/login`,
        session: false,
    }),
    googleCallback
);

export default router;