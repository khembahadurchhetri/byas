import type { Request, Response } from "express";
import fs from "node:fs";
import path from "node:path";

import Report from "../models/Report.js";

export async function getReports(
  _req: Request,
  res: Response
) {
  try {
    const reports = await Report.find({
      published: true,
    }).sort({
      createdAt: -1,
    });

    return res.json(reports);
  } catch (error) {
    console.error("Get reports error:", error);

    return res.status(500).json({
      message: "Failed to load reports",
    });
  }
}

export async function createReport(
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
      ? `/uploads/reports/${req.file.filename}`
      : "";

    const report = await Report.create({
      title: title.trim(),
      fileUrl,
      published: published !== "false",
    });

    return res.status(201).json({
      message: "Report created successfully",
      report,
    });
  } catch (error) {
    console.error("Create report error:", error);

    return res.status(500).json({
      message: "Failed to create report",
    });
  }
}

export async function updateReport(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;
    const { title, published } = req.body;

    const report = await Report.findById(id);

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    if (title !== undefined) {
      report.title = title.trim();
    }

    if (published !== undefined) {
      report.published =
        published === true ||
        published === "true";
    }

    if (req.file) {
      if (report.fileUrl) {
        const oldFilePath = path.join(
          process.cwd(),
          report.fileUrl.replace(
            /^\/uploads\//,
            "uploads/"
          )
        );

        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      report.fileUrl =
        `/uploads/reports/${req.file.filename}`;
    }

    await report.save();

    return res.json({
      message: "Report updated successfully",
      report,
    });
  } catch (error) {
    console.error("Update report error:", error);

    return res.status(500).json({
      message: "Failed to update report",
    });
  }
}

export async function deleteReport(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    const report = await Report.findById(id);

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    if (report.fileUrl) {
      const filePath = path.join(
        process.cwd(),
        report.fileUrl.replace(
          /^\/uploads\//,
          "uploads/"
        )
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await report.deleteOne();

    return res.json({
      message: "Report deleted successfully",
    });
  } catch (error) {
    console.error("Delete report error:", error);

    return res.status(500).json({
      message: "Failed to delete report",
    });
  }
}