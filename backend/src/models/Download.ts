import mongoose, { Schema } from "mongoose";

const downloadSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    fileUrl: {
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

const Download =
  mongoose.models.Download ||
  mongoose.model("Download", downloadSchema);

export default Download;