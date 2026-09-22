import { Router } from "express";

import {
  createReport,
  deleteReport,
  getReports,
  updateReport,
} from "../controllers/reportController.js";

import reportUpload from "../middleware/reportUpload.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = Router();

/* PUBLIC */

router.get(
  "/",
  getReports
);

/* ADMIN ONLY */

router.post(
  "/",
  requireAdmin,
  reportUpload.single(
    "file"
  ),
  createReport
);

router.patch(
  "/:id",
  requireAdmin,
  reportUpload.single(
    "file"
  ),
  updateReport
);

router.delete(
  "/:id",
  requireAdmin,
  deleteReport
);

export default router;