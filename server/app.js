import { PrismaClient } from '@prisma/client';
import express from 'express';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

// Маршрут для проверки
app.post('/users', async (req, res) => {
    try {
        const { email, name } = req.body;
        const newUser = await prisma.user.create({
            data: { email, name },
        });
        res.json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(5000, '0.0.0.0', () => console.log('Listening on port 5000'));