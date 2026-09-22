import "dotenv/config";

import path from "node:path";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import downloadRoutes from "./routes/downloadRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import successStoryRoutes from "./routes/successStoryRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import achievementRoutes from "./routes/achievementRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";

const app = express();

const PORT =
  Number(process.env.PORT) ||
  5000;

app.use(
  cors({
    origin:
      process.env.FRONTEND_URL ||
      "http://localhost:3000",

    credentials: true,
  })
);

app.use(express.json());

app.use(cookieParser());

app.use(
  "/uploads",
  express.static(
    path.join(
      process.cwd(),
      "uploads"
    )
  )
);

app.get(
  "/",
  (_req, res) => {
    res.json({
      message:
        "Mahila SACCOS API is running",
    });
  }
);

app.get(
  "/api/health",
  (_req, res) => {
    res.json({
      success: true,
      message:
        "Backend is healthy",
    });
  }
);

/* AUTH */

app.use(
  "/api/auth",
  authRoutes
);

/* PUBLIC + ADMIN CONTENT */

app.use(
  "/api/reports",
  reportRoutes
);

app.use(
  "/api/downloads",
  downloadRoutes
);

app.use(
  "/api/gallery",
  galleryRoutes
);

app.use(
  "/api/news",
  newsRoutes
);

app.use(
  "/api/success-stories",
  successStoryRoutes
);

app.use(
  "/api/messages",
  messageRoutes
);

app.use(
  "/api/team",
  teamRoutes
);

app.use(
  "/api/achievements",
  achievementRoutes
);

app.use(
  "/api/services",
  serviceRoutes
);

async function startServer() {
  await connectDB();

  app.listen(
    PORT,
    () => {
      console.log(
        `Express server running on http://localhost:${PORT}`
      );
    }
  );
}

startServer();