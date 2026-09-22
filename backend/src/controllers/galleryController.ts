import type { Request, Response } from "express";
import fs from "node:fs";
import path from "node:path";

import Gallery from "../models/Gallery.js";

export async function getGallery(
  _req: Request,
  res: Response
) {
  try {
    const images = await Gallery.find({
      published: true,
    }).sort({
      createdAt: -1,
    });

    return res.json(images);
  } catch (error) {
    console.error("Get gallery error:", error);

    return res.status(500).json({
      message: "Failed to load gallery",
    });
  }
}

export async function createGalleryImage(
  req: Request,
  res: Response
) {
  try {
    const { title, published } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    const imageUrl =
      `/uploads/gallery/${req.file.filename}`;

    const image = await Gallery.create({
      title: title?.trim() || "",
      imageUrl,
      published: published !== "false",
    });

    return res.status(201).json({
      message: "Gallery image added successfully",
      image,
    });
  } catch (error) {
    console.error("Create gallery error:", error);

    return res.status(500).json({
      message: "Failed to add gallery image",
    });
  }
}

export async function updateGalleryImage(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;
    const { title, published } = req.body;

    const image = await Gallery.findById(id);

    if (!image) {
      return res.status(404).json({
        message: "Gallery image not found",
      });
    }

    if (title !== undefined) {
      image.title = title.trim();
    }

    if (published !== undefined) {
      image.published =
        published === true ||
        published === "true";
    }

    if (req.file) {
      if (image.imageUrl) {
        const oldImagePath = path.join(
          process.cwd(),
          image.imageUrl.replace(
            /^\/uploads\//,
            "uploads/"
          )
        );

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      image.imageUrl =
        `/uploads/gallery/${req.file.filename}`;
    }

    await image.save();

    return res.json({
      message: "Gallery image updated successfully",
      image,
    });
  } catch (error) {
    console.error("Update gallery error:", error);

    return res.status(500).json({
      message: "Failed to update gallery image",
    });
  }
}

export async function deleteGalleryImage(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    const image = await Gallery.findById(id);

    if (!image) {
      return res.status(404).json({
        message: "Gallery image not found",
      });
    }

    if (image.imageUrl) {
      const imagePath = path.join(
        process.cwd(),
        image.imageUrl.replace(
          /^\/uploads\//,
          "uploads/"
        )
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await image.deleteOne();

    return res.json({
      message: "Gallery image deleted successfully",
    });
  } catch (error) {
    console.error("Delete gallery error:", error);

    return res.status(500).json({
      message: "Failed to delete gallery image",
    });
  }
}