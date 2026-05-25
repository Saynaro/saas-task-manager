import crypto from "crypto";
import bcrypt from "bcrypt";
import { prisma } from "../config/db.js";
import { transporter } from "../config/mailer.js";
import redisClient from "../config/redis.js";


/////// EMAIL VERIFICATION \\\\\\\
export const sendVerificationEmail = async (userId, email) => {
    const token = crypto.randomBytes(32).toString("hex");

    // save in redis for 24 hrs
    await redisClient.setEx(`verify:${token}`, 24 * 60 * 60, userId);

    const url = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

    // send email 
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify Your Email",
        html: `
            <h2>Welcome!</h2>
            <p>Click the link below to verify your email:</p>
            <a href="${url}" style="background:#4f46e5;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;">
                Verify Email
            </a>
            <p>Link expires in 24 hours.</p>
        `
    })
};



/////// EMAIL VERIFICATION \\\
export const verifyEmail = async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ error: "Token is required" });
    }

    try {
        const userId = await redisClient.get(`verify:${token}`);

        if (!userId) {
            return res.status(400).json({ error: "Invalid or expired token" });
        }

        await prisma.user.update({
            where: { id: userId },
            data: { isVerified: true }
        });


        // delete token from redis
        await redisClient.del(`verify:${token}`);

        res.status(200).json({
            success: true,
            message: "Email verified successfully"
        });

    } catch (error) {
        console.error("Error verifying email:", error);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
};



/////// FORGOT PASSWORD \\\\\
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (!user) {
            return res.status(200).json({
                message: "If this email exists, a reset link has been sent"
            });
        }

        // generate token
        const token = crypto.randomBytes(32).toString("hex");
        console.log("Saving reset token to Redis:", `reset:${token}`);

        // store in redis for 15 min
        await redisClient.setEx(`reset:${token}`, 60 * 15, user.id);

        const saved = await redisClient.get(`reset:${token}`);
        console.log("Saved in Redis:", saved);

        const url = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Reset your password",
            html: `
                <h2>Password Reset</h2>
                <p>Click the link below to reset your password:</p>
                <a href="${url}" style="background:#4f46e5;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;">
                    Reset Password
                </a>
                <p>Link expires in 15 minutes.</p>
                <p>If you didn't request this, ignore this email.</p>
        `
        })
        res.status(200).json({
            message: "If this email exists, a reset link has been sent"
        });
    } catch (error) {
        console.error("Error sending forgot password email:", error);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
};


////// RESET PASSWORD \\\\
export const resetPassword = async (req, res) => {
    const { token, password } = req.body;
    console.log("RESET PASSWORD:", { token: token ? "exists" : "missing", password: password ? "exists" : "missing" });

    if (!token || !password) {
        return res.status(400).json({
            error: "Token and password are required"
        });
    }

    try {
        const userId = await redisClient.get(`reset:${token}`);
        console.log("userId from Redis:", userId);

        if (!userId) {
            return res.status(400).json({
                error: "Invalid or expired token"
            });
        }


        // validate password
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                error: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter and one number"
            });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // update user password
        await prisma.user.update({
            where: { id: userId },
            data: { passwordHash: hashedPassword }
        });

        // delete token from redis
        await redisClient.del(`reset:${token}`);

        // delete all refresh tokens for this user
        await prisma.refreshToken.deleteMany({
            where: { userId }
        });

        res.status(200).json({
            message: "Password reset successfully"
        });

    } catch (error) {
        console.error("Error resetting password:", error);
        return res.status(500).json({
            error: "Failed to reset password"
        });
    }
};

export const resendVerificationEmail = async (req, res) => {
    try {
        const userId = req.user.id;
        const email = req.user.email;

        await sendVerificationEmail(userId, email);

        res.status(200).json({
            success: true,
            message: "Verification email sent successfully"
        });
    } catch (error) {
        console.error("Error resending verification email:", error);
        res.status(500).json({
            error: "Failed to send verification email"
        });
    }
};

