import type {
  NextFunction,
  Request,
  Response,
} from "express";

import jwt from "jsonwebtoken";

interface AdminTokenPayload {
  adminId: string;
  email: string;
}

export interface AuthenticatedRequest
  extends Request {
  admin?: AdminTokenPayload;
}

export default function requireAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const token =
      req.cookies?.admin_token;

    if (!token) {
      return res
        .status(401)
        .json({
          message:
            "Admin authentication required.",
        });
    }

    const secret =
      process.env.JWT_SECRET;

    if (!secret) {
      console.error(
        "JWT_SECRET is not configured."
      );

      return res
        .status(500)
        .json({
          message:
            "Authentication configuration error.",
        });
    }

    const decoded =
      jwt.verify(
        token,
        secret
      ) as AdminTokenPayload;

    req.admin = decoded;

    next();
  } catch {
    return res
      .status(401)
      .json({
        message:
          "Invalid or expired login.",
      });
  }
}