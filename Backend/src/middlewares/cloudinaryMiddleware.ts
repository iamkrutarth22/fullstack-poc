// const cloudinary = require('cloudinary').v2;

import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

import { v4 as uuidv4 } from "uuid";

import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

dotenv.config();

cloudinary.config();
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: "app-images",
    format: "png",
    public_id: uuidv4() + file.originalname,
  }),
});

const cloudinaryMiddleware = multer({ storage: storage });
export default cloudinaryMiddleware;
