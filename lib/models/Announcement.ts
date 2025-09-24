import mongoose, { Schema, models } from "mongoose";

const AnnouncementSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ["general", "course", "payment", "system"],
      default: "general"
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium"
    },
    targetAudience: {
      type: String,
      enum: ["all", "enrolled", "unenrolled", "specific"],
      default: "all"
    },
    isActive: {
      type: Boolean,
      default: true
    },
    expiresAt: {
      type: Date,
      default: null
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true
    },
    specificStudents: [{
      type: Schema.Types.ObjectId,
      ref: "User"
    }]
  },
  { timestamps: true }
);

export const AnnouncementModel = models.Announcement || mongoose.model("Announcement", AnnouncementSchema);
