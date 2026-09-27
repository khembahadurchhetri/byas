import "dotenv/config";

import path from "node:path";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";

import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import successStoryRoutes from "./routes/successStoryRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import achievementRoutes from "./routes/achievementRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";

const app = express();
app.set("trust proxy", 1);

const PORT = Number(process.env.PORT) || 5000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",

    credentials: true,
  }),
);

app.use(express.json());

app.use(cookieParser());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (_req, res) => {
  res.json({
    message: "Vyas Credits and Savings API is running",
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Backend is healthy",
  });
});

/* AUTH */

app.use("/api/auth", authRoutes);

/* PUBLIC + ADMIN CONTENT */

app.use("/api/reports", reportRoutes);

app.use("/api/gallery", galleryRoutes);

app.use("/api/news", newsRoutes);

app.use("/api/success-stories", successStoryRoutes);

app.use("/api/messages", messageRoutes);

app.use("/api/team", teamRoutes);

app.use("/api/achievements", achievementRoutes);

app.use("/api/services", serviceRoutes);

app.use(
  (
    error: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({
          message:
            "File is too large. Maximum allowed size is 25 MB for images or 50 MB for PDFs.",
        });
      }

      return res.status(400).json({
        message: error.message,
      });
    }

    if (error instanceof Error) {
      const message = error.message;

      if (message.includes("still too large after optimization")) {
        return res.status(413).json({
          message,
        });
      }

      return res.status(500).json({
        message,
      });
    }

    return res.status(500).json({
      message: "Unexpected upload error",
    });
  },
);

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Express server running on http://localhost:${PORT}`);
  });
}

startServer();
