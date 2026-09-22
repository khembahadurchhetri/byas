import { Router } from "express";

import serviceUpload from "../middleware/serviceUpload.js";
import requireAdmin from "../middleware/requireAdmin.js";

import {
  createService,
  deleteService,
  getServiceBySlug,
  getServices,
  updateService,
} from "../controllers/serviceController.js";

const router = Router();

/* PUBLIC */

router.get(
  "/",
  getServices
);

router.get(
  "/:slug",
  getServiceBySlug
);

/* ADMIN ONLY */

router.post(
  "/",
  requireAdmin,
  serviceUpload.single(
    "image"
  ),
  createService
);

router.patch(
  "/:id",
  requireAdmin,
  serviceUpload.single(
    "image"
  ),
  updateService
);

router.delete(
  "/:id",
  requireAdmin,
  deleteService
);

export default router;