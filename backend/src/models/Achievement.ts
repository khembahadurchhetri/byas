import mongoose, { Schema } from "mongoose";

const achievementSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    imageUrl: {
      type: String,
      default: "",
    },

    order: {
      type: Number,
      default: 1,
    },

    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Achievement =
  mongoose.models.Achievement ||
  mongoose.model(
    "Achievement",
    achievementSchema
  );

export default Achievement;