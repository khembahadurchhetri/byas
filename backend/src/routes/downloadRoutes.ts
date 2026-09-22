import { Router } from "express";

import {
  createDownload,
  deleteDownload,
  getDownloads,
  updateDownload,
} from "../controllers/downloadController.js";

import downloadUpload from "../middleware/downloadUpload.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = Router();

/* PUBLIC */

router.get(
  "/",
  getDownloads
);

/* ADMIN ONLY */

router.post(
  "/",
  requireAdmin,
  downloadUpload.single(
    "file"
  ),
  createDownload
);

router.patch(
  "/:id",
  requireAdmin,
  downloadUpload.single(
    "file"
  ),
  updateDownload
);

router.delete(
  "/:id",
  requireAdmin,
  deleteDownload
);

export default router;