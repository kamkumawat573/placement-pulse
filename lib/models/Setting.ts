import mongoose, { Schema, models } from "mongoose";

const SettingSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    value: {
      type: Schema.Types.Mixed,
      required: true
    },
    type: {
      type: String,
      enum: ["string", "number", "boolean", "object", "array"],
      default: "string"
    },
    description: {
      type: String,
      default: ""
    },
    category: {
      type: String,
      default: "general"
    },
    isPublic: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export const SettingModel = models.Setting || mongoose.model("Setting", SettingSchema);