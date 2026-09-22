import { Router } from "express";

import {
  getCurrentAdmin,
  loginAdmin,
  logoutAdmin,
} from "../controllers/authController.js";

import requireAdmin from "../middleware/requireAdmin.js";

const router = Router();

router.post(
  "/login",
  loginAdmin
);

router.post(
  "/logout",
  logoutAdmin
);

router.get(
  "/me",
  requireAdmin,
  getCurrentAdmin
);

export default router;