import type {
  Request,
  Response,
} from "express";

import fs from "node:fs";
import path from "node:path";

import Report from "../models/Report.js";

function getStoredFilePath(
  fileUrl: string
) {
  return path.join(
    process.cwd(),
    fileUrl.replace(
      /^\/uploads\//,
      "uploads/"
    )
  );
}

export async function getReports(
  _req: Request,
  res: Response
) {
  try {
    const reports =
      await Report.find({
        published: true,
      }).sort({
        reportDate: -1,
        createdAt: -1,
      });

    return res.json(
      reports
    );
  } catch (error) {
    console.error(
      "Get reports error:",
      error
    );

    return res
      .status(500)
      .json({
        message:
          "Failed to load reports",
      });
  }
}

export async function createReport(
  req: Request,
  res: Response
) {
  try {
    const {
      title,
      reportDate,
      published,
    } = req.body;

    if (!title?.trim()) {
      return res
        .status(400)
        .json({
          message:
            "Title is required",
        });
    }

    if (!reportDate) {
      return res
        .status(400)
        .json({
          message:
            "Report date is required",
        });
    }

    const parsedReportDate =
      new Date(
        reportDate
      );

    if (
      Number.isNaN(
        parsedReportDate.getTime()
      )
    ) {
      return res
        .status(400)
        .json({
          message:
            "Invalid report date",
        });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({
          message:
            "PDF file is required",
        });
    }

    const fileUrl =
      `/uploads/reports/${req.file.filename}`;

    const report =
      await Report.create({
        title:
          title.trim(),

        fileUrl,

        reportDate:
          parsedReportDate,

        published:
          published !==
          "false",
      });

    return res
      .status(201)
      .json({
        message:
          "Report created successfully",
        report,
      });
  } catch (error) {
    console.error(
      "Create report error:",
      error
    );

    return res
      .status(500)
      .json({
        message:
          "Failed to create report",
      });
  }
}

export async function updateReport(
  req: Request,
  res: Response
) {
  try {
    const { id } =
      req.params;

    const {
      title,
      reportDate,
      published,
    } = req.body;

    const report =
      await Report.findById(
        id
      );

    if (!report) {
      return res
        .status(404)
        .json({
          message:
            "Report not found",
        });
    }

    if (
      title !==
      undefined
    ) {
      if (
        !title.trim()
      ) {
        return res
          .status(400)
          .json({
            message:
              "Title cannot be empty",
          });
      }

      report.title =
        title.trim();
    }

    if (
      reportDate !==
      undefined
    ) {
      if (!reportDate) {
        return res
          .status(400)
          .json({
            message:
              "Report date is required",
          });
      }

      const parsedReportDate =
        new Date(
          reportDate
        );

      if (
        Number.isNaN(
          parsedReportDate.getTime()
        )
      ) {
        return res
          .status(400)
          .json({
            message:
              "Invalid report date",
          });
      }

      report.reportDate =
        parsedReportDate;
    }

    if (
      published !==
      undefined
    ) {
      report.published =
        published ===
          true ||
        published ===
          "true";
    }

    if (req.file) {
      if (
        report.fileUrl
      ) {
        const oldFilePath =
          getStoredFilePath(
            report.fileUrl
          );

        if (
          fs.existsSync(
            oldFilePath
          )
        ) {
          fs.unlinkSync(
            oldFilePath
          );
        }
      }

      report.fileUrl =
        `/uploads/reports/${req.file.filename}`;
    }

    await report.save();

    return res.json({
      message:
        "Report updated successfully",
      report,
    });
  } catch (error) {
    console.error(
      "Update report error:",
      error
    );

    return res
      .status(500)
      .json({
        message:
          "Failed to update report",
      });
  }
}

export async function deleteReport(
  req: Request,
  res: Response
) {
  try {
    const { id } =
      req.params;

    const report =
      await Report.findById(
        id
      );

    if (!report) {
      return res
        .status(404)
        .json({
          message:
            "Report not found",
        });
    }

    if (
      report.fileUrl
    ) {
      const filePath =
        getStoredFilePath(
          report.fileUrl
        );

      if (
        fs.existsSync(
          filePath
        )
      ) {
        fs.unlinkSync(
          filePath
        );
      }
    }

    await report.deleteOne();

    return res.json({
      message:
        "Report deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete report error:",
      error
    );

    return res
      .status(500)
      .json({
        message:
          "Failed to delete report",
      });
  }
}