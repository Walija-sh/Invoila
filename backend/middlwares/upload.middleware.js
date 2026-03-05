import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import AppError from "../utils/appError.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "invoila_profiles",
    allowed_formats: ["jpg", "png", "jpeg"],
     transformation: [{ width: 800, height: 800, crop: 'limit' }]
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Only image files are allowed", 400), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
   limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

export default upload;