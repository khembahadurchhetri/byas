import type {
  Request,
  Response,
} from "express";

import fs from "node:fs";
import path from "node:path";

import Achievement from "../models/Achievement.js";

function deleteImage(
  imageUrl?: string
) {
  if (!imageUrl) return;

  try {
    const relativePath =
      imageUrl.replace(
        /^\/uploads\//,
        ""
      );

    const fullPath = path.join(
      process.cwd(),
      "uploads",
      relativePath
    );

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (error) {
    console.error(
      "Achievement image cleanup error:",
      error
    );
  }
}

export async function getAchievements(
  _req: Request,
  res: Response
) {
  try {
    const achievements =
      await Achievement.find().sort({
        order: 1,
        createdAt: 1,
      });

    return res.json(achievements);
  } catch (error) {
    console.error(
      "Get achievements error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to load achievements.",
    });
  }
}

export async function createAchievement(
  req: Request,
  res: Response
) {
  try {
    const {
      title,
      description,
      order,
      published,
    } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        message:
          "Achievement title is required.",
      });
    }

    const achievement =
      await Achievement.create({
        title: title.trim(),

        description:
          description?.trim() || "",

        order:
          Number(order) || 1,

        published:
          published !== "false",

        imageUrl: req.file
          ? `/uploads/achievements/${req.file.filename}`
          : "",
      });

    return res
      .status(201)
      .json(achievement);
  } catch (error) {
    console.error(
      "Create achievement error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to create achievement.",
    });
  }
}

export async function updateAchievement(
  req: Request,
  res: Response
) {
  try {
    const achievement =
      await Achievement.findById(
        req.params.id
      );

    if (!achievement) {
      return res.status(404).json({
        message:
          "Achievement not found.",
      });
    }

    const {
      title,
      description,
      order,
      published,
    } = req.body;

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          message:
            "Achievement title cannot be empty.",
        });
      }

      achievement.title =
        title.trim();
    }

    if (description !== undefined) {
      achievement.description =
        description.trim();
    }

    if (order !== undefined) {
      achievement.order =
        Number(order) || 1;
    }

    if (published !== undefined) {
      achievement.published =
        published === "true";
    }

    if (req.file) {
      deleteImage(
        achievement.imageUrl
      );

      achievement.imageUrl =
        `/uploads/achievements/${req.file.filename}`;
    }

    await achievement.save();

    return res.json(achievement);
  } catch (error) {
    console.error(
      "Update achievement error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to update achievement.",
    });
  }
}

export async function deleteAchievement(
  req: Request,
  res: Response
) {
  try {
    const achievement =
      await Achievement.findById(
        req.params.id
      );

    if (!achievement) {
      return res.status(404).json({
        message:
          "Achievement not found.",
      });
    }

    deleteImage(
      achievement.imageUrl
    );

    await achievement.deleteOne();

    return res.json({
      message:
        "Achievement deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete achievement error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to delete achievement.",
    });
  }
}