import mongoose, { Schema } from "mongoose";

const newsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    titleHtml: {
      type: String,
      default: "",
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    summary: {
      type: String,
      default: "",
      trim: true,
    },

    content: {
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
  },
);

const News = mongoose.models.News || mongoose.model("News", newsSchema);

export default News;
