import { Router } from "express";

import {
  changeAdminPassword,
  getCurrentAdmin,
  loginAdmin,
  logoutAdmin,
} from "../controllers/authController.js";

import requireAdmin from "../middleware/requireAdmin.js";

const router = Router();

/* =========================
   PUBLIC AUTH
========================= */

router.post(
  "/login",
  loginAdmin
);

router.post(
  "/logout",
  logoutAdmin
);

/* =========================
   ADMIN AUTH
========================= */

router.get(
  "/me",
  requireAdmin,
  getCurrentAdmin
);

router.patch(
  "/change-password",
  requireAdmin,
  changeAdminPassword
);

export default router;