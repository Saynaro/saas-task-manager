
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from "cors";

import { config } from "dotenv";
import { prisma } from './config/db.js';

import authRoutes from "./routes/authRoutes.js";

config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors());


app.use("/api/auth", authRoutes);

export default app;