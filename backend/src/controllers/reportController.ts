import type {
  Request,
  Response,
} from "express";

import cloudinary from "../config/cloudinary.js";
import Report from "../models/Report.js";

import {
  uploadFileToCloudinary,
} from "../utils/uploadToCloudinary.js";

import {
  compressPdf,
} from "../utils/compressPdf.js";

const CLOUDINARY_MAX_PDF_SIZE =
  10 * 1024 * 1024;

function formatMb(bytes: number) {
  return (
    bytes /
    1024 /
    1024
  ).toFixed(2);
}

async function preparePdfForCloudinary(
  buffer: Buffer
) {
  console.log(
    `Original PDF size: ${formatMb(
      buffer.length
    )} MB`
  );

  const compressed =
    await compressPdf(buffer);

  console.log(
    `Compressed PDF size: ${formatMb(
      compressed.length
    )} MB`
  );

  if (
    compressed.length >
    CLOUDINARY_MAX_PDF_SIZE
  ) {
    return {
      ok: false as const,
      buffer: compressed,
    };
  }

  return {
    ok: true as const,
    buffer: compressed,
  };
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

    return res.json(reports);
  } catch (error) {
    console.error(
      "Get reports error:",
      error
    );

    return res.status(500).json({
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
      return res.status(400).json({
        message:
          "Title is required",
      });
    }

    if (!reportDate) {
      return res.status(400).json({
        message:
          "Report date is required",
      });
    }

    const parsedReportDate =
      new Date(reportDate);

    if (
      Number.isNaN(
        parsedReportDate.getTime()
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid report date",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message:
          "PDF file is required",
      });
    }

    const preparedPdf =
      await preparePdfForCloudinary(
        req.file.buffer
      );

    if (!preparedPdf.ok) {
      return res.status(413).json({
        message:
          `PDF was compressed from ${formatMb(
            req.file.buffer.length
          )} MB to ${formatMb(
            preparedPdf.buffer.length
          )} MB, but it is still above the current 10 MB Cloudinary upload limit.`,
      });
    }

    const uploadResult =
      await uploadFileToCloudinary(
        preparedPdf.buffer,
        "byas/reports",
        "raw"
      );

    const report =
      await Report.create({
        title:
          title.trim(),

        fileUrl:
          uploadResult.secure_url,

        filePublicId:
          uploadResult.public_id,

        reportDate:
          parsedReportDate,

        published:
          published !== "false",
      });

    return res.status(201).json({
      message:
        "Report created successfully",
      report,
    });
  } catch (error) {
    console.error(
      "Create report error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "";

    if (
      message.includes(
        "gswin64c"
      ) ||
      message.includes(
        "ENOENT"
      )
    ) {
      return res.status(500).json({
        message:
          "PDF compression service is not available on the server.",
      });
    }

    return res.status(500).json({
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
      await Report.findById(id);

    if (!report) {
      return res.status(404).json({
        message:
          "Report not found",
      });
    }

    if (
      title !== undefined
    ) {
      if (!title.trim()) {
        return res.status(400).json({
          message:
            "Title cannot be empty",
        });
      }

      report.title =
        title.trim();
    }

    if (
      reportDate !== undefined
    ) {
      if (!reportDate) {
        return res.status(400).json({
          message:
            "Report date is required",
        });
      }

      const parsedReportDate =
        new Date(reportDate);

      if (
        Number.isNaN(
          parsedReportDate.getTime()
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid report date",
        });
      }

      report.reportDate =
        parsedReportDate;
    }

    if (
      published !== undefined
    ) {
      report.published =
        published === true ||
        published === "true";
    }

    if (req.file) {
      const preparedPdf =
        await preparePdfForCloudinary(
          req.file.buffer
        );

      if (!preparedPdf.ok) {
        return res.status(413).json({
          message:
            `PDF was compressed from ${formatMb(
              req.file.buffer.length
            )} MB to ${formatMb(
              preparedPdf.buffer.length
            )} MB, but it is still above the current 10 MB Cloudinary upload limit.`,
        });
      }

      const uploadResult =
        await uploadFileToCloudinary(
          preparedPdf.buffer,
          "byas/reports",
          "raw"
        );

      if (
        report.filePublicId
      ) {
        await cloudinary.uploader.destroy(
          report.filePublicId,
          {
            resource_type:
              "raw",
          }
        );
      }

      report.fileUrl =
        uploadResult.secure_url;

      report.filePublicId =
        uploadResult.public_id;
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

    const message =
      error instanceof Error
        ? error.message
        : "";

    if (
      message.includes(
        "gswin64c"
      ) ||
      message.includes(
        "ENOENT"
      )
    ) {
      return res.status(500).json({
        message:
          "PDF compression service is not available on the server.",
      });
    }

    return res.status(500).json({
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
      await Report.findById(id);

    if (!report) {
      return res.status(404).json({
        message:
          "Report not found",
      });
    }

    if (
      report.filePublicId
    ) {
      await cloudinary.uploader.destroy(
        report.filePublicId,
        {
          resource_type:
            "raw",
        }
      );
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

    return res.status(500).json({
      message:
        "Failed to delete report",
    });
  }
}