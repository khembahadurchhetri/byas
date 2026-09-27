import type { Request, Response } from "express";

import Gallery from "../models/Gallery.js";
import cloudinary from "../config/cloudinary.js";
import { uploadImageToCloudinary } from "../utils/uploadToCloudinary.js";

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

    const uploadResult =
      await uploadImageToCloudinary(
        req.file.buffer,
        "byas/gallery"
      );

    const image = await Gallery.create({
      title: title?.trim() || "",
      imageUrl: uploadResult.secure_url,
      imagePublicId: uploadResult.public_id,
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
      const uploadResult =
        await uploadImageToCloudinary(
          req.file.buffer,
          "byas/gallery"
        );

      if (image.imagePublicId) {
        await cloudinary.uploader.destroy(
          image.imagePublicId,
          {
            resource_type: "image",
          }
        );
      }

      image.imageUrl =
        uploadResult.secure_url;

      image.imagePublicId =
        uploadResult.public_id;
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

    if (image.imagePublicId) {
      await cloudinary.uploader.destroy(
        image.imagePublicId,
        {
          resource_type: "image",
        }
      );
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