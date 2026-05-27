import multer from "multer";
import cloudinary from "./cloudinary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "avatars",
        allowed_formats: ["jpg", "png", "jpeg", "webp", "svg"],
        transformation: [{ width: 200, height: 200, crop: 'fill', gravity: 'face' }]
    }
});

export const uploadAvatar = multer({
    storage,
    limits: {
        fileSize: 2 * 1024 * 1024
    }
});

