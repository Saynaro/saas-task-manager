import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

export const authMiddleware = async (req, res, next) => {
    let token;

    // if token in headers take it else if it is in cookie take it.
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.jwt) {
        token = req.cookies.jwt;
    };

    if (!token) {
        return res.status(401).json({ error: "Not authorized, no token provided" })
    };

    // verify token and take userID
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
            }
        });

        if (!user) {
            return res.status(401).json({ error: "User no longer exists" });
        };

        req.user = user;

        next();
    } catch (error) {
        console.error("JWT Error:", error.message);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Token expired" });
        }

        return res.status(401).json({ error: "Not authorized, token failed" })
    };
};