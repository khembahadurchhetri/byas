import { Router } from "express";

import achievementUpload from "../middleware/achievementUpload.js";
import requireAdmin from "../middleware/requireAdmin.js";

import {
  createAchievement,
  deleteAchievement,
  getAchievements,
  updateAchievement,
} from "../controllers/achievementController.js";

const router = Router();

/* PUBLIC */

router.get(
  "/",
  getAchievements
);

/* ADMIN ONLY */

router.post(
  "/",
  requireAdmin,
  achievementUpload.single("image"),
  createAchievement
);

router.patch(
  "/:id",
  requireAdmin,
  achievementUpload.single("image"),
  updateAchievement
);

router.delete(
  "/:id",
  requireAdmin,
  deleteAchievement
);

export default router;