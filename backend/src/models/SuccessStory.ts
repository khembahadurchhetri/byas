import mongoose, { Schema } from "mongoose";

const successStorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      default: "",
      trim: true,
    },

    story: {
      type: String,
      default: "",
    },

    imageUrl: {
      type: String,
      default: "",
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

const SuccessStory =
  mongoose.models.SuccessStory ||
  mongoose.model(
    "SuccessStory",
    successStorySchema
  );

export default SuccessStory;