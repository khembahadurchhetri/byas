import type {
  Request,
  Response,
} from "express";

import fs from "node:fs";
import path from "node:path";

import News from "../models/News.js";
function createSlug(title: string) {
  return title
    .normalize("NFC")
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{M}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function uniqueSlug(
  title: string,
  currentId?: string
) {
  const baseSlug =
    createSlug(title) ||
    `news-${Date.now()}`;

  let slug = baseSlug;
  let number = 1;

  while (true) {
    const existing =
      await News.findOne({
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

    slug = `${baseSlug}-${number}`;
    number++;
  }
}

export async function getNews(
  _req: Request,
  res: Response
) {
  try {
    const news =
      await News.find({
        published: true,
      }).sort({
        createdAt: -1,
      });

    return res.json(news);
  } catch (error) {
    console.error(
      "Get news error:",
      error
    );

    return res
      .status(500)
      .json({
        message:
          "Failed to load news",
      });
  }
}

export async function getAllNewsForAdmin(
  _req: Request,
  res: Response
) {
  try {
    const news =
      await News.find({}).sort({
        createdAt: -1,
      });

    return res.json(news);
  } catch (error) {
    console.error(
      "Get admin news error:",
      error
    );

    return res
      .status(500)
      .json({
        message:
          "Failed to load admin news",
      });
  }
}

export async function getNewsBySlug(
  req: Request,
  res: Response
) {
  try {
    const news =
      await News.findOne({
        slug:
          req.params.slug,
        published: true,
      });

    if (!news) {
      return res
        .status(404)
        .json({
          message:
            "News not found",
        });
    }

    return res.json(news);
  } catch (error) {
    console.error(
      "Get news by slug error:",
      error
    );

    return res
      .status(500)
      .json({
        message:
          "Failed to load news",
      });
  }
}

export async function createNews(
  req: Request,
  res: Response
) {
  try {
    const {
      title,
      titleHtml,
      summary,
      content,
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

    const cleanTitle =
      title.trim();

    const slug =
      await uniqueSlug(
        cleanTitle
      );

    const imageUrl =
      req.file
        ? `/uploads/news/${req.file.filename}`
        : "";

    const news =
      await News.create({
        title: cleanTitle,

        titleHtml:
          titleHtml || "",

        slug,

        summary:
          summary?.trim() ||
          "",

        content:
          content || "",

        imageUrl,

        published:
          published !==
          "false",
      });

    return res
      .status(201)
      .json({
        message:
          "News created successfully",

        news,
      });
  } catch (error) {
    console.error(
      "Create news error:",
      error
    );

    return res
      .status(500)
      .json({
        message:
          "Failed to create news",
      });
  }
}

export async function updateNews(
  req: Request,
  res: Response
) {
  try {
    const { id } =
      req.params;

    const {
      title,
      titleHtml,
      summary,
      content,
      published,
    } = req.body;

    const news =
      await News.findById(id);

    if (!news) {
      return res
        .status(404)
        .json({
          message:
            "News not found",
        });
    }

    if (
      title !== undefined
    ) {
      const cleanTitle =
        title.trim();

      if (!cleanTitle) {
        return res
          .status(400)
          .json({
            message:
              "Title is required",
          });
      }

      if (
        cleanTitle !==
        news.title
      ) {
        news.slug =
          await uniqueSlug(
            cleanTitle,
            news.id
          );
      }

      news.title =
        cleanTitle;
    }

    if (
      titleHtml !==
      undefined
    ) {
      news.titleHtml =
        titleHtml || "";
    }

    if (
      summary !==
      undefined
    ) {
      news.summary =
        summary.trim();
    }

    if (
      content !==
      undefined
    ) {
      news.content =
        content;
    }

    if (
      published !==
      undefined
    ) {
      news.published =
        published === true ||
        published ===
          "true";
    }

    if (req.file) {
      if (
        news.imageUrl
      ) {
        const oldImagePath =
          path.join(
            process.cwd(),

            news.imageUrl.replace(
              /^\/uploads\//,
              "uploads/"
            )
          );

        if (
          fs.existsSync(
            oldImagePath
          )
        ) {
          fs.unlinkSync(
            oldImagePath
          );
        }
      }

      news.imageUrl =
        `/uploads/news/${req.file.filename}`;
    }

    await news.save();

    return res.json({
      message:
        "News updated successfully",

      news,
    });
  } catch (error) {
    console.error(
      "Update news error:",
      error
    );

    return res
      .status(500)
      .json({
        message:
          "Failed to update news",
      });
  }
}

export async function deleteNews(
  req: Request,
  res: Response
) {
  try {
    const news =
      await News.findById(
        req.params.id
      );

    if (!news) {
      return res
        .status(404)
        .json({
          message:
            "News not found",
        });
    }

    if (news.imageUrl) {
      const imagePath =
        path.join(
          process.cwd(),

          news.imageUrl.replace(
            /^\/uploads\//,
            "uploads/"
          )
        );

      if (
        fs.existsSync(
          imagePath
        )
      ) {
        fs.unlinkSync(
          imagePath
        );
      }
    }

    await news.deleteOne();

    return res.json({
      message:
        "News deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete news error:",
      error
    );

    return res
      .status(500)
      .json({
        message:
          "Failed to delete news",
      });
  }
}