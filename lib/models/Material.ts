import mongoose, { Schema, models } from "mongoose";

const MaterialSchema = new Schema(
  {
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    title: { type: String, required: true },
    description: { type: String },
    fileUrl: { type: String },
    content: { type: String }, // optional rich text / URL
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
  },
  { timestamps: true }
);

export const MaterialModel = models.Material || mongoose.model("Material", MaterialSchema);

