
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from "cors";

import { config } from "dotenv";
import { apiRateLimit } from './middlewares/rateLimiter.js';

import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import invitationRoutes from "./routes/invitationRoutes.js";
import workspaceRoutes from "./routes/workspaceRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

config();

const app = express();
app.set('trust proxy', 1); // if rate limiting is used in production

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
}));


app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
    });
});



app.use("/api/auth", authRoutes);

app.use("/api/projects", apiRateLimit, projectRoutes);
app.use("/api/invitations", apiRateLimit, invitationRoutes);
app.use("/api/workspaces", apiRateLimit, workspaceRoutes);
app.use("/api/admin", apiRateLimit, adminRoutes);
app.use("/api/email", apiRateLimit, emailRoutes);
app.use("/api/projects/:projectId/comments", apiRateLimit, commentRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack || err);

    res.status(err.status || 500).json({
        message: err.message || "Internal server error",
    });
});



export default app;