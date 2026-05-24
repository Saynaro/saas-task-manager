import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { prisma } from '../config/db.js'


export const generateAccessToken = (userId, userRole) => {
    return jwt.sign(
        { id: userId, role: userRole },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    );
}


export const generateRefreshToken = async (userId, res) => {
    const token = jwt.sign(
        { id: userId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
    );

    // hash before saving to db
    const hashedToken = await bcrypt.hash(token, 10);

    await prisma.refreshToken.create({
        data: {
            userId,
            token: hashedToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
    });

    res.cookie("saas_refresh_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: (1000 * 60 * 60 * 24) * 7,
        path: "/"
    });

    return token;
}




// // generate access token
// export const generateToken = (userId, userRole, res) => {
//     const payload = { id: userId, role: userRole };

//     if (!process.env.JWT_SECRET) {
//         throw new Error("JWT_SECRET is not defined in .env file");
//     }

//     const token = jwt.sign(payload, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRES_IN || "7d",
//     });

//     res.cookie("jwt", token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "Lax",
//         maxAge: (1000 * 60 * 60 * 24) * 7,
//         path: "/"
//     });

//     return token;
// };