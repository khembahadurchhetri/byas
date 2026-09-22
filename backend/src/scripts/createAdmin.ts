import "dotenv/config";

import bcrypt from "bcryptjs";

import { connectDB } from "../config/db.js";
import Admin from "../models/Admin.js";

async function createAdmin() {
  await connectDB();

  const email =
    process.env.ADMIN_EMAIL?.trim().toLowerCase();

  const password =
    process.env.ADMIN_PASSWORD;

  const name =
    process.env.ADMIN_NAME?.trim() ||
    "Administrator";

  if (!email || !password) {
    console.error(
      "ADMIN_EMAIL and ADMIN_PASSWORD are required in .env"
    );

    process.exit(1);
  }

  const existing =
    await Admin.findOne({
      email,
    });

  if (existing) {
    console.log(
      `Admin already exists: ${email}`
    );

    process.exit(0);
  }

  const passwordHash =
    await bcrypt.hash(
      password,
      12
    );

  await Admin.create({
    email,
    passwordHash,
    name,
  });

  console.log(
    `Admin created successfully: ${email}`
  );

  process.exit(0);
}

createAdmin().catch(
  (error) => {
    console.error(
      "Create admin error:",
      error
    );

    process.exit(1);
  }
);