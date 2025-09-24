import mongoose, { Schema, models } from "mongoose"

const VideoSchema = new Schema(
  {
    videoId: { type: String, unique: true, required: true },
    title: { type: String, required: true },
    description: { type: String },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String },
    duration: { type: String }, // e.g., "5:30"
    category: { type: String, default: 'preview' },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: "Admin" }
  },
  { timestamps: true }
)

export const VideoModel = models.Video || mongoose.model("Video", VideoSchema)
