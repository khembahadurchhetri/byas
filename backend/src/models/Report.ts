import mongoose, {
  Schema,
} from "mongoose";

const reportSchema =
  new Schema(
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

      reportDate: {
        type: Date,
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

const Report =
  mongoose.models.Report ||
  mongoose.model(
    "Report",
    reportSchema
  );

export default Report;