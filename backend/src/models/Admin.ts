import mongoose, {
  Schema,
} from "mongoose";

const adminSchema =
  new Schema(
    {
      email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
      },

      passwordHash: {
        type: String,
        required: true,
      },

      name: {
        type: String,
        default: "Administrator",
        trim: true,
      },
    },
    {
      timestamps: true,
    }
  );

const Admin =
  mongoose.models.Admin ||
  mongoose.model(
    "Admin",
    adminSchema
  );

export default Admin;