import { Router } from "express";

import {
  createNews,
  deleteNews,
  getAllNewsForAdmin,
  getNews,
  getNewsBySlug,
  updateNews,
} from "../controllers/newsController.js";

import newsUpload from "../middleware/newsUpload.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = Router();

/* =========================
   PUBLIC
========================= */

router.get(
  "/",
  getNews
);

/*
 * IMPORTANT:
 * Keep /admin/all BEFORE /:slug
 * otherwise "admin" could be
 * treated as a news slug.
 */

router.get(
  "/admin/all",
  requireAdmin,
  getAllNewsForAdmin
);

router.get(
  "/:slug",
  getNewsBySlug
);

/* =========================
   ADMIN ONLY
========================= */

router.post(
  "/",
  requireAdmin,
  newsUpload.single(
    "image"
  ),
  createNews
);

router.patch(
  "/:id",
  requireAdmin,
  newsUpload.single(
    "image"
  ),
  updateNews
);

router.delete(
  "/:id",
  requireAdmin,
  deleteNews
);

export default router;