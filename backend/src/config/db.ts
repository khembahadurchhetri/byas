import mongoose from "mongoose";
import dns from "node:dns";

export async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing from backend/.env");
  }

  dns.setServers(["8.8.8.8", "1.1.1.1"]);

  try {
    await mongoose.connect(mongoUri);

    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:");
    console.error(error);

    process.exit(1);
  }
}