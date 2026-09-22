import { Router } from "express";

import {
  createSuccessStory,
  deleteSuccessStory,
  getSuccessStories,
  getSuccessStoryById,
  updateSuccessStory,
} from "../controllers/successStoryController.js";

import successStoryUpload from "../middleware/successStoryUpload.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = Router();

/* PUBLIC */

router.get(
  "/",
  getSuccessStories
);

router.get(
  "/:id",
  getSuccessStoryById
);

/* ADMIN ONLY */

router.post(
  "/",
  requireAdmin,
  successStoryUpload.single("image"),
  createSuccessStory
);

router.patch(
  "/:id",
  requireAdmin,
  successStoryUpload.single("image"),
  updateSuccessStory
);

router.delete(
  "/:id",
  requireAdmin,
  deleteSuccessStory
);

export default router;