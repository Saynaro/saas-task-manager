import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

// in prisma 7 adapter is used for connection pooling
// Prisma connection pool using pg driver
const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20, // 20 connections max
    idleTimeoutMillis: 30000
});
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"]
});

const connectDB = async () => {
    try {
        await pool.query('SELECT 1');
        console.log("DataBase connected via Prisma 7 Adapter!");
    } catch (error) {
        console.error(
            "DataBase connection error:",
            error instanceof Error ? error.message : error
        );
        process.exit(1);
    }
};

const disconnectDB = async () => {
    await prisma.$disconnect();
    await pool.end(); // IMPORTANT to close pg driver's pool 
};

export { prisma, pool, connectDB, disconnectDB };
