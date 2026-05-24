import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;




///////// REGISTER ////////
export const register = async (req, res) => {
    try {
        const { firstname, lastname, email, password, avatarUrl, inviteCode } = req.body;

        let role = "MEMBER";
        if (inviteCode === process.env.ADMIN_INVITE_CODE) role = "ADMIN";
        if (inviteCode === process.env.OWNER_INVITE_CODE) role = "OWNER";


        if (!firstname || !lastname || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }


        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: "Password must be at least 8 characters long, contain 1 uppercase letter, 1 lowercase letter, and 1 number" });
        }

        const userExists = await prisma.user.findUnique({
            where: { email: email },
        });

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }


        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    firstName: firstname,
                    lastName: lastname,
                    email: email,
                    passwordHash: hashedPassword,
                    avatarUrl: avatarUrl,
                    role: role
                },
            });

            // Auto-create workspace for OWNERS only
            if (role === "OWNER") {
                await tx.workspace.create({
                    data: {
                        name: `${firstname}'s Workspace`,
                        slug: `${firstname.toLowerCase()}-${newUser.id.slice(0, 5)}`,
                        creatorId: newUser.id,
                        members: {
                            create: {
                                userId: newUser.id,
                                role: "OWNER"
                            }
                        }
                    }
                });
            }

            return newUser;
        });

        const accessToken = generateAccessToken(user.id, user.role);
        await generateRefreshToken(user.id, res);

        res.status(201).json({
            status: "success",
            data: {
                user: {
                    id: user.id,
                    name: user.firstName,
                    surname: user.lastName,
                    email: user.email,
                    avatarUrl: user.avatarUrl,
                },
                accessToken,
            },
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Internal server error"
        })
    }
};




///////// LOGIN ////////
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: "Invalid password format" });
        }

        const user = await prisma.user.findUnique({
            where: { email: email },
        });

        if (!user) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        };

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        const accessToken = generateAccessToken(user.id, user.role);
        await generateRefreshToken(user.id, res);

        res.status(200).json({
            status: "success",
            data: {
                user: {
                    id: user.id,
                    name: user.firstName,
                    surname: user.lastName,
                    email: user.email,
                    avatarUrl: user.avatarUrl,
                },
                accessToken,
            },
        });

    } catch (error) {
        console.error("LOGIN ERROR:", error);
        res.status(500).json({
            error: "Internal server error"
        })
    }
};




///////// LOGOUT ////////
export const logout = async (req, res) => {
    try {
        const token = req.cookies?.saas_refresh_token;

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

            const storedTokens = await prisma.refreshToken.findMany({
                where: {
                    userId: decoded.id,
                }
            })

            for (const t of storedTokens) {
                const match = await bcrypt.compare(token, t.token);
                if (match) {
                    await prisma.refreshToken.delete({
                        where: {
                            id: t.id
                        }
                    });
                    break;
                }
            }
        }
    } catch (err) {
        // token is invalid or expired - just log and continue to clean cookie
        console.error("Logout token error:", err.message);
    } finally {
        res.clearCookie("saas_refresh_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
            path: "/"
        });
        
        res.clearCookie("activeWorkspace", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
            path: "/"
        });

        res.status(200).json({ status: "success", message: "Logged out successfully" });
    }
};



///////// REFRESH ////////
export const refresh = async (req, res) => {

    const token = req.cookies?.saas_refresh_token;
    if (!token) {
        return res.status(401).json({
            error: "No refresh token found"
        });
    }

    try {

        // verify token for taking user id
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);


        const storedTokens = await prisma.refreshToken.findMany({
            where: {
                userId: decoded.id,
                expiresAt: {
                    gt: new Date()  // greater than current date
                },
            },
            include: {
                user: true
            }
        })

        let validToken = null;
        for (const t of storedTokens) {
            const match = await bcrypt.compare(token, t.token);
            if (match) {
                validToken = t;
                break;
            }
        }

        if (!validToken) {
            return res.status(401).json({
                error: "No valid refresh token found"
            });
        }


        // generate new tokens FIRST, then delete old one
        // This way, if something fails mid-way, the old token still works
        const accessToken = generateAccessToken(validToken.user.id, validToken.user.role);
        await generateRefreshToken(validToken.user.id, res);

        // delete old token only after new one is safely issued
        await prisma.refreshToken.delete({
            where: {
                id: validToken.id
            }
        });

        res.status(200).json({
            status: "success",
            accessToken,
        });

    } catch (error) {
        console.error("REFRESH ERROR:", error.message);
        return res.status(401).json({ error: "Invalid refresh token" });
    }
}




///////// GET ME ////////


export const getMe = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
        });
        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        res.status(200).json({
            status: "success",
            data: { user: req.user }
        });
    } catch (error) {
        console.error("GET ME ERROR:", error);
        res.status(500).json({
            error: "Internal server error"
        })
        res.status(404).json({ error: "User not found" });
    }
};





///////// UPDATE ME ////////
export const updateMe = async (req, res) => {
    try {
        const { firstName, lastName, email, avatarUrl, jobTitle, bio } = req.body;
        const userId = req.user.id;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                firstName: firstName,
                lastName: lastName,
                email: email,
                avatarUrl: avatarUrl
            }
        });

        res.status(200).json({
            status: "success",
            data: {
                user: {
                    id: updatedUser.id,
                    firstname: updatedUser.firstName,
                    lastname: updatedUser.lastName,
                    email: updatedUser.email,
                    avatarUrl: updatedUser.avatarUrl,
                }
            }
        });
    } catch (error) {
        console.error("UPDATE ME ERROR:", error);
        res.status(500).json({ error: "Could not update profile" });
    }
};

export const selectWorkspace = async (req, res) => {
    try {
        const { workspaceId } = req.body;

        res.cookie("activeWorkspace", workspaceId, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            path: "/"
        });

        res.status(200).json({
            status: "success",
            message: "Workspace selected"
        });
    } catch (error) {
        console.error("SELECT WORKSPACE ERROR:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};