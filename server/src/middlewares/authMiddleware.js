import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

export const authMiddleware = async (req, res, next) => {
    let token;

    // if token in headers take it else if it is in cookie take it.
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

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
                role: true,
                isVerified: true,
                workspaces: {
                    include: {
                        workspace: true
                    }
                }
            }
        });

        if (!user) {
            return res.status(401).json({ error: "User no longer exists" });
        };

        // Active workspace selection logic
        const selectedWsId = req.cookies?.activeWorkspace;
        let primaryWorkspace;

        if (selectedWsId) {
            primaryWorkspace = user.workspaces.find(ws => ws.workspaceId === selectedWsId)?.workspace;
        }

        // Fallback to first if not selected or selection invalid
        if (!primaryWorkspace) {
            primaryWorkspace = user.workspaces?.[0]?.workspace;
        }

        req.user = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            avatarUrl: user.avatarUrl,
            role: user.role,
            isVerified: user.isVerified,
            workspace: primaryWorkspace,
            allWorkspaces: user.workspaces.map(w => ({
                id: w.workspace.id,
                name: w.workspace.name,
                role: w.role
            }))
        };

        next();
    } catch (error) {
        console.error("JWT Error:", error.message);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Token expired" });
        }

        return res.status(401).json({ error: "Not authorized, token failed" })
    };
};