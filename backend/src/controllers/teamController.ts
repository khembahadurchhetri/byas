import type { Request, Response } from "express";

import cloudinary from "../config/cloudinary.js";
import TeamMember from "../models/TeamMember.js";
import { uploadImageToCloudinary } from "../utils/uploadToCloudinary.js";

const VALID_GROUPS = ["board", "audit", "management"];

export async function getTeamMembers(req: Request, res: Response) {
  try {
    const group = req.query.group as string | undefined;

    const filter: Record<string, unknown> = {};

    if (group) {
      if (!VALID_GROUPS.includes(group)) {
        return res.status(400).json({
          message: "Invalid team group.",
        });
      }

      filter.group = group;
    }

    const members = await TeamMember.find(filter).sort({
      order: 1,
      createdAt: 1,
    });

    return res.json(members);
  } catch (error) {
    console.error("Get team members error:", error);

    return res.status(500).json({
      message: "Failed to load team members.",
    });
  }
}

export async function createTeamMember(req: Request, res: Response) {
  try {
    const {
      name,

      position,

      group,
      order,
      published,
    } = req.body;

    if (!name || !position || !group) {
      return res.status(400).json({
        message: "English name, position and group are required.",
      });
    }

    if (!VALID_GROUPS.includes(group)) {
      return res.status(400).json({
        message: "Invalid team group.",
      });
    }

    let imageUrl = "";
    let imagePublicId = "";

    if (req.file) {
      const uploadResult = await uploadImageToCloudinary(
        req.file.buffer,
        "byas/team",
      );

      imageUrl = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
    }

    const member = await TeamMember.create({
      name: name.trim(),

      position: position.trim(),

      group,
      order: Number(order) || 0,
      published: published !== "false",

      imageUrl,
      imagePublicId,
    });

    return res.status(201).json(member);
  } catch (error) {
    console.error("Create team member error:", error);

    return res.status(500).json({
      message: "Failed to create team member.",
    });
  }
}

export async function updateTeamMember(req: Request, res: Response) {
  try {
    const member = await TeamMember.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        message: "Team member not found.",
      });
    }

    const { name, nameNp, position, positionNp, group, order, published } =
      req.body;

    if (group && !VALID_GROUPS.includes(group)) {
      return res.status(400).json({
        message: "Invalid team group.",
      });
    }

    if (name !== undefined) {
      member.name = name.trim();
    }

    if (nameNp !== undefined) {
      member.nameNp = nameNp.trim();
    }

    if (position !== undefined) {
      member.position = position.trim();
    }

    if (positionNp !== undefined) {
      member.positionNp = positionNp.trim();
    }

    if (group !== undefined) {
      member.group = group;
    }

    if (order !== undefined) {
      member.order = Number(order) || 0;
    }

    if (published !== undefined) {
      member.published = published === "true";
    }

    if (req.file) {
      const uploadResult = await uploadImageToCloudinary(
        req.file.buffer,
        "byas/team",
      );

      if (member.imagePublicId) {
        await cloudinary.uploader.destroy(member.imagePublicId, {
          resource_type: "image",
        });
      }

      member.imageUrl = uploadResult.secure_url;
      member.imagePublicId = uploadResult.public_id;
    }

    await member.save();

    return res.json(member);
  } catch (error) {
    console.error("Update team member error:", error);

    return res.status(500).json({
      message: "Failed to update team member.",
    });
  }
}

export async function deleteTeamMember(req: Request, res: Response) {
  try {
    const member = await TeamMember.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        message: "Team member not found.",
      });
    }

    if (member.imagePublicId) {
      await cloudinary.uploader.destroy(member.imagePublicId, {
        resource_type: "image",
      });
    }

    await member.deleteOne();

    return res.json({
      message: "Team member deleted successfully.",
    });
  } catch (error) {
    console.error("Delete team member error:", error);

    return res.status(500).json({
      message: "Failed to delete team member.",
    });
  }
}
