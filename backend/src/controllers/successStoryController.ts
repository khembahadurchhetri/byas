import type { Request, Response } from "express";

import cloudinary from "../config/cloudinary.js";
import SuccessStory from "../models/SuccessStory.js";
import { uploadImageToCloudinary } from "../utils/uploadToCloudinary.js";

export async function getSuccessStories(_req: Request, res: Response) {
  try {
    const stories = await SuccessStory.find({
      published: true,
    }).sort({
      createdAt: -1,
    });

    return res.json(stories);
  } catch (error) {
    console.error("Get success stories error:", error);

    return res.status(500).json({
      message: "Failed to load success stories",
    });
  }
}

export async function getSuccessStoryById(req: Request, res: Response) {
  try {
    const story = await SuccessStory.findOne({
      _id: req.params.id,
      published: true,
    });

    if (!story) {
      return res.status(404).json({
        message: "Success story not found",
      });
    }

    return res.json(story);
  } catch (error) {
    console.error("Get success story error:", error);

    return res.status(500).json({
      message: "Failed to load success story",
    });
  }
}

export async function createSuccessStory(req: Request, res: Response) {
  try {
    const { name, title, story, published } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    let imageUrl = "";
    let imagePublicId = "";

    if (req.file) {
      const uploadResult = await uploadImageToCloudinary(
        req.file.buffer,
        "byas/success-stories",
      );

      imageUrl = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
    }

    const successStory = await SuccessStory.create({
      name: name.trim(),
      title: title?.trim() || "",
      story: story || "",
      imageUrl,
      imagePublicId,
      published: published !== "false",
    });

    return res.status(201).json({
      message: "Success story created",
      successStory,
    });
  } catch (error) {
    console.error("Create success story error:", error);

    return res.status(500).json({
      message: "Failed to create success story",
    });
  }
}

export async function updateSuccessStory(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const { name, title, story, published } = req.body;

    const successStory = await SuccessStory.findById(id);

    if (!successStory) {
      return res.status(404).json({
        message: "Success story not found",
      });
    }

    if (name !== undefined) {
      successStory.name = name.trim();
    }

    if (title !== undefined) {
      successStory.title = title.trim();
    }

    if (story !== undefined) {
      successStory.story = story;
    }

    if (published !== undefined) {
      successStory.published = published === true || published === "true";
    }

    if (req.file) {
      const uploadResult = await uploadImageToCloudinary(
        req.file.buffer,
        "byas/success-stories",
      );

      if (successStory.imagePublicId) {
        await cloudinary.uploader.destroy(successStory.imagePublicId, {
          resource_type: "image",
        });
      }

      successStory.imageUrl = uploadResult.secure_url;
      successStory.imagePublicId = uploadResult.public_id;
    }

    await successStory.save();

    return res.json({
      message: "Success story updated",
      successStory,
    });
  } catch (error) {
    console.error("Update success story error:", error);

    return res.status(500).json({
      message: "Failed to update success story",
    });
  }
}

export async function deleteSuccessStory(req: Request, res: Response) {
  try {
    const successStory = await SuccessStory.findById(req.params.id);

    if (!successStory) {
      return res.status(404).json({
        message: "Success story not found",
      });
    }

    if (successStory.imagePublicId) {
      await cloudinary.uploader.destroy(successStory.imagePublicId, {
        resource_type: "image",
      });
    }

    await successStory.deleteOne();

    return res.json({
      message: "Success story deleted",
    });
  } catch (error) {
    console.error("Delete success story error:", error);

    return res.status(500).json({
      message: "Failed to delete success story",
    });
  }
}
