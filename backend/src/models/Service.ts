import mongoose, { Schema } from "mongoose";

const serviceSectionSchema = new Schema(
  {
    heading: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      default: "",
    },

    order: {
      type: Number,
      default: 1,
    },
  },
  {
    _id: false,
  }
);

const serviceSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    group: {
      type: String,
      required: true,
      enum: [
        "savings",
        "loans",
        "loan-documents",
        "digital",
    
        "other",
      ],
    },

    type: {
      type: String,
      required: true,
      enum: [
        "content",
        "image",
        "external-link",
      ],
      default: "content",
    },

    subtitle: {
      type: String,
      default: "",
      trim: true,
    },

    sections: {
      type: [serviceSectionSchema],
      default: [],
    },

    imageUrl: {
      type: String,
      default: "",
    },

    externalUrl: {
      type: String,
      default: "",
      trim: true,
    },

    buttonText: {
      type: String,
      default: "Open",
      trim: true,
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

const Service =
  mongoose.models.Service ||
  mongoose.model(
    "Service",
    serviceSchema
  );

export default Service;