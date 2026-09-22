import { Router } from "express";

import {
  createGalleryImage,
  deleteGalleryImage,
  getGallery,
  updateGalleryImage,
} from "../controllers/galleryController.js";

import galleryUpload from "../middleware/galleryUpload.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = Router();

/* PUBLIC */

router.get(
  "/",
  getGallery
);

/* ADMIN ONLY */

router.post(
  "/",
  requireAdmin,
  galleryUpload.single("image"),
  createGalleryImage
);

router.patch(
  "/:id",
  requireAdmin,
  galleryUpload.single("image"),
  updateGalleryImage
);

router.delete(
  "/:id",
  requireAdmin,
  deleteGalleryImage
);

export default router;