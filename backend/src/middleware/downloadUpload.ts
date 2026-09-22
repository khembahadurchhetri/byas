import multer from "multer";
import path from "node:path";
import fs from "node:fs";

const uploadDirectory = path.join(
  process.cwd(),
  "uploads",
  "downloads"
);

fs.mkdirSync(uploadDirectory, {
  recursive: true,
});

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (_req, file, cb) => {
    const uniqueName =
      `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

    const extension = path.extname(file.originalname);

    cb(null, `${uniqueName}${extension}`);
  },
});

const downloadUpload = multer({
  storage,

  limits: {
    fileSize: 200 * 1024 * 1024,
  },
});

export default downloadUpload;