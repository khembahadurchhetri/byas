import { Router } from "express";

import teamUpload from "../middleware/teamUpload.js";
import requireAdmin from "../middleware/requireAdmin.js";

import {
  createTeamMember,
  deleteTeamMember,
  getTeamMembers,
  updateTeamMember,
} from "../controllers/teamController.js";

const router = Router();

/* PUBLIC */

router.get(
  "/",
  getTeamMembers
);

/* ADMIN ONLY */

router.post(
  "/",
  requireAdmin,
  teamUpload.single("image"),
  createTeamMember
);

router.patch(
  "/:id",
  requireAdmin,
  teamUpload.single("image"),
  updateTeamMember
);

router.delete(
  "/:id",
  requireAdmin,
  deleteTeamMember
);

export default router;