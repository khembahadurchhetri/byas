import mongoose, { Schema } from "mongoose";

const gallerySchema = new Schema(
  {
    title: {
      type: String,
      default: "",
      trim: true,
    },

    imageUrl: {
      type: String,
      required: true,
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

const Gallery =
  mongoose.models.Gallery ||
  mongoose.model("Gallery", gallerySchema);

export default Gallery;