import type { Request, Response } from "express";
import fs from "node:fs";
import path from "node:path";

import Download from "../models/Download.js";

export async function getDownloads(
  _req: Request,
  res: Response
) {
  try {
    const downloads = await Download.find({
      published: true,
    }).sort({
      createdAt: -1,
    });

    return res.json(downloads);
  } catch (error) {
    console.error("Get downloads error:", error);

    return res.status(500).json({
      message: "Failed to load downloads",
    });
  }
}

export async function createDownload(
  req: Request,
  res: Response
) {
  try {
    const { title, published } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    const fileUrl = req.file
      ? `/uploads/downloads/${req.file.filename}`
      : "";

    const download = await Download.create({
      title: title.trim(),
      fileUrl,
      published: published !== "false",
    });

    return res.status(201).json({
      message: "Download created successfully",
      download,
    });
  } catch (error) {
    console.error("Create download error:", error);

    return res.status(500).json({
      message: "Failed to create download",
    });
  }
}

export async function updateDownload(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;
    const { title, published } = req.body;

    const download = await Download.findById(id);

    if (!download) {
      return res.status(404).json({
        message: "Download not found",
      });
    }

    if (title !== undefined) {
      download.title = title.trim();
    }

    if (published !== undefined) {
      download.published =
        published === true ||
        published === "true";
    }

    if (req.file) {
      if (download.fileUrl) {
        const oldFilePath = path.join(
          process.cwd(),
          download.fileUrl.replace(
            /^\/uploads\//,
            "uploads/"
          )
        );

        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      download.fileUrl =
        `/uploads/downloads/${req.file.filename}`;
    }

    await download.save();

    return res.json({
      message: "Download updated successfully",
      download,
    });
  } catch (error) {
    console.error("Update download error:", error);

    return res.status(500).json({
      message: "Failed to update download",
    });
  }
}

export async function deleteDownload(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    const download = await Download.findById(id);

    if (!download) {
      return res.status(404).json({
        message: "Download not found",
      });
    }

    if (download.fileUrl) {
      const filePath = path.join(
        process.cwd(),
        download.fileUrl.replace(
          /^\/uploads\//,
          "uploads/"
        )
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await download.deleteOne();

    return res.json({
      message: "Download deleted successfully",
    });
  } catch (error) {
    console.error("Delete download error:", error);

    return res.status(500).json({
      message: "Failed to delete download",
    });
  }
}