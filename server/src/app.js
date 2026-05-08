
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from "cors";

import { config } from "dotenv";
import { prisma } from './config/db.js';

import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";

config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));


app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

export default app;