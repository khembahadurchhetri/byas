import type {
  Request,
  Response,
} from "express";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Admin from "../models/Admin.js";

function getCookieOptions() {
  const isProduction =
    process.env.NODE_ENV ===
    "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite:
      isProduction
        ? ("none" as const)
        : ("lax" as const),
    maxAge:
      7 *
      24 *
      60 *
      60 *
      1000,
  };
}

export async function loginAdmin(
  req: Request,
  res: Response
) {
  try {
    const { email, password } =
      req.body;

    if (
      !email?.trim() ||
      !password
    ) {
      return res
        .status(400)
        .json({
          message:
            "Email and password are required.",
        });
    }

    const admin =
      await Admin.findOne({
        email: email
          .trim()
          .toLowerCase(),
      });

    if (!admin) {
      return res
        .status(401)
        .json({
          message:
            "Invalid email or password.",
        });
    }

    const passwordMatches =
      await bcrypt.compare(
        password,
        admin.passwordHash
      );

    if (
      !passwordMatches
    ) {
      return res
        .status(401)
        .json({
          message:
            "Invalid email or password.",
        });
    }

    const secret =
      process.env.JWT_SECRET;

    if (!secret) {
      console.error(
        "JWT_SECRET is missing."
      );

      return res
        .status(500)
        .json({
          message:
            "Authentication configuration error.",
        });
    }

    const token =
      jwt.sign(
        {
          adminId:
            admin._id.toString(),
          email:
            admin.email,
        },
        secret,
        {
          expiresIn: "7d",
        }
      );

    res.cookie(
      "admin_token",
      token,
      getCookieOptions()
    );

    return res.json({
      success: true,

      admin: {
        id:
          admin._id.toString(),
        email:
          admin.email,
        name:
          admin.name,
      },
    });
  } catch (error) {
    console.error(
      "Admin login error:",
      error
    );

    return res
      .status(500)
      .json({
        message:
          "Failed to login.",
      });
  }
}

export async function logoutAdmin(
  _req: Request,
  res: Response
) {
  res.clearCookie(
    "admin_token",
    {
      httpOnly: true,
      secure:
        process.env
          .NODE_ENV ===
        "production",
      sameSite:
        process.env
          .NODE_ENV ===
        "production"
          ? "none"
          : "lax",
    }
  );

  return res.json({
    success: true,
    message:
      "Logged out successfully.",
  });
}

export async function getCurrentAdmin(
  req: Request & {
    admin?: {
      adminId: string;
      email: string;
    };
  },
  res: Response
) {
  try {
    if (
      !req.admin?.adminId
    ) {
      return res
        .status(401)
        .json({
          message:
            "Not authenticated.",
        });
    }

    const admin =
      await Admin.findById(
        req.admin.adminId
      ).select(
        "_id email name"
      );

    if (!admin) {
      return res
        .status(401)
        .json({
          message:
            "Admin account not found.",
        });
    }

    return res.json({
      id:
        admin._id.toString(),
      email:
        admin.email,
      name:
        admin.name,
    });
  } catch (error) {
    console.error(
      "Get current admin error:",
      error
    );

    return res
      .status(500)
      .json({
        message:
          "Failed to verify admin.",
      });
  }
}

export async function changeAdminPassword(
  req: Request,
  res: Response
) {
  try {
    const authReq = req as Request & {
      admin?: {
        adminId: string;
        email: string;
      };
    };

    const adminId =
      authReq.admin?.adminId;

    if (!adminId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const {
      currentPassword,
      newPassword,
    } = req.body;

    if (
      !currentPassword ||
      !newPassword
    ) {
      return res.status(400).json({
        message:
          "Current password and new password are required.",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message:
          "New password must be at least 8 characters.",
      });
    }

    const admin =
      await Admin.findById(
        adminId
      );

    if (!admin) {
      return res.status(404).json({
        message:
          "Admin account not found.",
      });
    }

    const correctPassword =
      await bcrypt.compare(
        currentPassword,
        admin.passwordHash
      );

    if (!correctPassword) {
      return res.status(400).json({
        message:
          "Current password is incorrect.",
      });
    }

    const samePassword =
      await bcrypt.compare(
        newPassword,
        admin.passwordHash
      );

    if (samePassword) {
      return res.status(400).json({
        message:
          "New password must be different from the current password.",
      });
    }

    admin.passwordHash =
      await bcrypt.hash(
        newPassword,
        12
      );

    await admin.save();

    return res.json({
      message:
        "Password changed successfully.",
    });
  } catch (error) {
    console.error(
      "Change password error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to change password.",
    });
  }
}