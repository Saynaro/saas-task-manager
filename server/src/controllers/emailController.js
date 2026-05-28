import crypto from "crypto";
import bcrypt from "bcrypt";
import { prisma } from "../config/db.js";
import { transporter } from "../config/mailer.js";
import redisClient from "../config/redis.js";

// Helper function to render a professional, responsive HTML email layout
const renderEmailHtml = ({ title, greeting, body, buttonUrl, buttonText, warningText }) => {
    const currentYear = new Date().getFullYear();
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; -webkit-text-size-adjust: none; text-size-adjust: none;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f1f5f9; padding: 40px 20px; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <tr>
            <td align="center" valign="top">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.025); overflow: hidden;">
                    <!-- Logo / Header -->
                    <tr>
                        <td align="center" style="padding: 40px 40px 20px 40px;">
                            <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto; text-align: center;">
                                <tr>
                                    <td style="vertical-align: middle;">
                                        <div style="background-color: #005DA9; border-radius: 8px; width: 36px; height: 36px; line-height: 36px; text-align: center; color: #ffffff; font-weight: 800; font-size: 20px;">S</div>
                                    </td>
                                    <td style="vertical-align: middle; padding-left: 10px; font-size: 20px; font-weight: 800; color: #1e293b; letter-spacing: -0.5px;">
                                        SaaS Pro
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Content Body -->
                    <tr>
                        <td style="padding: 0 40px 40px 40px; text-align: left;">
                            <h1 style="font-size: 22px; font-weight: 700; color: #0f172a; margin: 0 0 16px 0; letter-spacing: -0.3px;">
                                ${title}
                            </h1>
                            <p style="font-size: 15px; line-height: 24px; color: #334155; margin: 0 0 16px 0;">
                                Hello ${greeting},
                            </p>
                            <p style="font-size: 15px; line-height: 24px; color: #475569; margin: 0 0 24px 0;">
                                ${body}
                            </p>
                            
                            <!-- Call to Action Button -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 30px 0; text-align: center;">
                                <tr>
                                    <td align="center">
                                        <a href="${buttonUrl}" target="_blank" style="background-color: #005DA9; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-size: 15px; font-weight: 600; display: inline-block; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2), 0 2px 4px -1px rgba(79, 70, 229, 0.1);">
                                            ${buttonText}
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Expiry Notice -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border-left: 4px solid #cbd5e1; border-radius: 0 6px 6px 0; margin-bottom: 24px;">
                                <tr>
                                    <td style="padding: 12px 16px; font-size: 13px; line-height: 20px; color: #64748b;">
                                        <strong>Security Notice:</strong> ${warningText}
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Fallback Link -->
                            <p style="font-size: 12px; line-height: 18px; color: #94a3b8; margin: 24px 0 0 0; word-break: break-all;">
                                If you're having trouble clicking the button, copy and paste this URL into your browser:<br/>
                                <a href="${buttonUrl}" style="color: #005DA9; text-decoration: underline;">${buttonUrl}</a>
                            </p>
                            
                            <!-- Divider -->
                            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
                            
                            <!-- Footer Office / Legal Info -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="text-align: center;">
                                <tr>
                                    <td style="font-size: 12px; line-height: 18px; color: #94a3b8;">
                                        This email was sent to you as a registered user of <a href="${clientUrl}" style="color: #64748b; text-decoration: underline;">SaaS Pro</a>.<br/>
                                        © ${currentYear} SaaS Pro, Inc. All rights reserved.<br/>
                                        Nice, France
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;
};

/////// EMAIL VERIFICATION \\\\\\\
export const sendVerificationEmail = async (userId, email) => {
    const token = crypto.randomBytes(32).toString("hex");

    // save in redis for 24 hrs
    await redisClient.setEx(`verify:${token}`, 24 * 60 * 60, userId);

    const url = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { firstName: true }
    });
    const firstName = user?.firstName || "there";

    const emailHtml = renderEmailHtml({
        title: "Verify Your Email Address",
        greeting: firstName,
        body: "Thank you for signing up for SaaS Pro! Before you can start managing your projects, tasks, and teams, we need you to confirm your email address.",
        buttonUrl: url,
        buttonText: "Verify Email",
        warningText: "This verification link is valid for 24 hours. If you did not create a SaaS Pro account, you can safely ignore this email."
    });

    // send email 
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify Your Email - SaaS Pro",
        html: emailHtml
    });
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
        const firstName = user.firstName || "there";

        const emailHtml = renderEmailHtml({
            title: "Reset Your Password",
            greeting: firstName,
            body: `We received a request to reset the password for your SaaS Pro account associated with <strong>${email}</strong>. Click the button below to set up a new password.`,
            buttonUrl: url,
            buttonText: "Reset Password",
            warningText: "For security reasons, this link will expire in 15 minutes. If you did not request a password reset, please ignore this email; your password will remain secure and unchanged."
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Reset Your Password - SaaS Pro",
            html: emailHtml
        });

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

