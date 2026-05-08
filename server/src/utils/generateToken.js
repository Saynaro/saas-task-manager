import jwt from 'jsonwebtoken'

export const generateToken = (userId, userRole, res) => {
    const payload = { id: userId, role: userRole };

    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in .env file");
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: (1000 * 60 * 60 * 24) * 7,
        path: "/"
    });

    return token;
};