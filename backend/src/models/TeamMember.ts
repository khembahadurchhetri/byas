import mongoose, { Schema } from "mongoose";

const teamMemberSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
   

    position: {
      type: String,
      required: true,
      trim: true,
    },
    
 

    imageUrl: {
      type: String,
      default: "",
    },

    group: {
      type: String,
      required: true,
      enum: ["board", "audit", "management"],
    },

    order: {
      type: Number,
      default: 0,
    },

    published: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const TeamMember =
  mongoose.models.TeamMember ||
  mongoose.model("TeamMember", teamMemberSchema);

export default TeamMember;