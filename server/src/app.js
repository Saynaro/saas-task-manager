
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from "cors";

import { config } from "dotenv";
import { prisma } from './config/db.js';
import { apiRateLimit } from './middlewares/rateLimiter.js';

import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import invitationRoutes from "./routes/invitationRoutes.js";
import workspaceRoutes from "./routes/workspaceRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";

config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
}));


app.use(apiRateLimit);

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/invitations", invitationRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/email", emailRoutes);

export default app;