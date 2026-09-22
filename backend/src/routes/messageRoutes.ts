import { Router } from "express";

import {
  createMessage,
  deleteMessage,
  getMessages,
  toggleMessageRead,
} from "../controllers/messageController.js";

import requireAdmin from "../middleware/requireAdmin.js";

const router = Router();

/*
 * PUBLIC
 * Website visitors need this
 * for the Contact form.
 */

router.post(
  "/",
  createMessage
);

/*
 * ADMIN ONLY
 */

router.get(
  "/",
  requireAdmin,
  getMessages
);

router.patch(
  "/:id/read",
  requireAdmin,
  toggleMessageRead
);

router.delete(
  "/:id",
  requireAdmin,
  deleteMessage
);

export default router;