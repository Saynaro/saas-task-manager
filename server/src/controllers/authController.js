import { prisma } from "../config/db.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";




///////// REGISTER ////////
export const register = async (req, res) => {
    try {
        const { firstname, lastname, email, password, avatarUrl } = req.body;

        if (!firstname || !lastname || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const userExists = await prisma.user.findUnique({
            where: { email: email },
        });

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }


        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data: {
                firstName: firstname,
                lastName: lastname,
                email: email,
                passwordHash: hashedPassword,
                avatarUrl: avatarUrl
            },
        });

        const token = generateToken(user.id, res);

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
                token,
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

        const token = generateToken(user.id, res);

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
                token,
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
        res.cookie("jwt", "", {
            httpOnly: true,
            expires: new Date(0),   // time now
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });

        res.status(200).json({
            status: "success",
            message: "Logged out successfully",
        });
    } catch (error) {
        console.error("LOGOUT ERROR:", error);
        res.status(500).json({
            error: "Internal server error"
        })
    }
};



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



export const updateMe = async (req, res) => {
    try {
        const { firstname, lastname, email, avatarUrl } = req.body;
        const userId = req.user.id;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                firstName: firstname,
                lastName: lastname,
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