import type { Request, Response } from "express";

import fs from "node:fs";
import path from "node:path";

import Service from "../models/Service.js";

const serviceGroups = [
  "savings",
  "loans",
  "loan-documents",
  "digital",
  "other",
];

const serviceTypes = ["content", "image", "external-link"];

function validateServiceKind(req: Request, res: Response) {
  const { group, type } = req.body;

  if (group !== undefined && !serviceGroups.includes(group)) {
    res.status(400).json({
      message: "Select a supported service group.",
    });

    return false;
  }

  if (type !== undefined && !serviceTypes.includes(type)) {
    res.status(400).json({
      message: "Select a supported service type.",
    });

    return false;
  }

  return true;
}
function createSlug(value: string) {
  return value
    .normalize("NFC")
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{M}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function uniqueSlug(title: string, currentId?: string) {
  const base = createSlug(title) || `service-${Date.now()}`;

  let slug = base;
  let count = 1;

  while (true) {
    const existing = await Service.findOne({
      slug,

      ...(currentId
        ? {
            _id: {
              $ne: currentId,
            },
          }
        : {}),
    });

    if (!existing) {
      return slug;
    }

    slug = `${base}-${count}`;
    count++;
  }
}

function parseSections(value: unknown) {
  if (!value) {
    return [];
  }

  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((section, index) => ({
        heading: String(section.heading || "").trim(),

        content: String(section.content || ""),

        order: Number(section.order) || index + 1,
      }))
      .filter((section) => section.heading || section.content);
  } catch {
    return [];
  }
}

function deleteOldImage(imageUrl?: string) {
  if (!imageUrl) {
    return;
  }

  try {
    const relativePath = imageUrl.replace(/^\/uploads\//, "");

    const fullPath = path.join(process.cwd(), "uploads", relativePath);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (error) {
    console.error("Service image cleanup error:", error);
  }
}

/* GET SERVICES */

export async function getServices(req: Request, res: Response) {
  try {
    const filter: Record<string, unknown> = {};

    if (req.query.group) {
      filter.group = req.query.group;
    }

    const services = await Service.find(filter).sort({
      order: 1,
      createdAt: 1,
    });

    return res.json(services);
  } catch (error) {
    console.error("Get services error:", error);

    return res.status(500).json({
      message: "Failed to load services.",
    });
  }
}

/* GET ONE */

export async function getServiceBySlug(req: Request, res: Response) {
  try {
    const service = await Service.findOne({
      slug: req.params.slug,
    });

    if (!service) {
      return res.status(404).json({
        message: "Service not found.",
      });
    }

    return res.json(service);
  } catch (error) {
    console.error("Get service error:", error);

    return res.status(500).json({
      message: "Failed to load service.",
    });
  }
}

/* CREATE */

export async function createService(req: Request, res: Response) {
  if (!validateServiceKind(req, res)) {
    return;
  }

  try {
    const {
      title,
      titleHtml,
      group,
      type,
      subtitle,
      externalUrl,
      buttonText,
      order,
      published,
    } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        message: "Title is required.",
      });
    }

    if (!group) {
      return res.status(400).json({
        message: "Service category is required.",
      });
    }

    if (!type) {
      return res.status(400).json({
        message: "Service content type is required.",
      });
    }

    if (type === "external-link" && !externalUrl?.trim()) {
      return res.status(400).json({
        message: "External URL is required.",
      });
    }

    const cleanTitle = title.trim();

    const slug = await uniqueSlug(cleanTitle);

    const service = await Service.create({
      title: cleanTitle,

      titleHtml: titleHtml || "",

      slug,

      group,

      type,

      subtitle: subtitle?.trim() || "",

      sections: type === "content" ? parseSections(req.body.sections) : [],

      imageUrl: req.file ? `/uploads/services/${req.file.filename}` : "",

      externalUrl: externalUrl?.trim() || "",

      buttonText: buttonText?.trim() || "Open Link",

      order: Number(order) || 1,

      published: published !== "false" && published !== false,
    });

    return res.status(201).json(service);
  } catch (error) {
    console.error("Create service error:", error);

    return res.status(500).json({
      message: "Failed to create service.",
    });
  }
}

/* UPDATE */

export async function updateService(req: Request, res: Response) {
  if (!validateServiceKind(req, res)) {
    return;
  }

  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        message: "Service not found.",
      });
    }

    const {
      title,
      titleHtml,
      group,
      type,
      subtitle,
      externalUrl,
      buttonText,
      order,
      published,
    } = req.body;

    if (title !== undefined) {
      const cleanTitle = title.trim();

      if (!cleanTitle) {
        return res.status(400).json({
          message: "Title cannot be empty.",
        });
      }

      
        service.slug = await uniqueSlug(cleanTitle, service.id);
      

      service.title = cleanTitle;
    }

    if (titleHtml !== undefined) {
      service.titleHtml = titleHtml || "";
    }

    if (group !== undefined) {
      service.group = group;
    }

    if (type !== undefined) {
      service.type = type;
    }

    if (subtitle !== undefined) {
      service.subtitle = subtitle.trim();
    }

    if (req.body.sections !== undefined) {
      service.sections = parseSections(req.body.sections);
    }

    if (externalUrl !== undefined) {
      service.externalUrl = externalUrl.trim();
    }

    if (buttonText !== undefined) {
      service.buttonText = buttonText.trim() || "Open Link";
    }

    if (order !== undefined) {
      service.order = Number(order) || 1;
    }

    if (published !== undefined) {
      service.published = published === true || published === "true";
    }

    if (req.file) {
      deleteOldImage(service.imageUrl);

      service.imageUrl = `/uploads/services/${req.file.filename}`;
    }

    await service.save();

    return res.json(service);
  } catch (error) {
    console.error("Update service error:", error);

    return res.status(500).json({
      message: "Failed to update service.",
    });
  }
}

/* DELETE */

export async function deleteService(req: Request, res: Response) {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        message: "Service not found.",
      });
    }

    deleteOldImage(service.imageUrl);

    await service.deleteOne();

    return res.json({
      message: "Service deleted successfully.",
    });
  } catch (error) {
    console.error("Delete service error:", error);

    return res.status(500).json({
      message: "Failed to delete service.",
    });
  }
}
