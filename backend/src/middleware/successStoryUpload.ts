import multer from "multer";

const storage = multer.memoryStorage();

const successStoryUpload = multer({
  storage,

  limits: {
    fileSize: 25 * 1024 * 1024,
  },

  fileFilter: (_req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG and WebP images are allowed"));
    }
  },
});

export default successStoryUpload;
