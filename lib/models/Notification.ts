import mongoose, { Schema, models } from "mongoose"

const NotificationSchema = new Schema(
  {
    id: { type: String, unique: true, required: true },
    type: { type: String, required: true, enum: ['blog', 'announcement', 'system'] },
    message: { type: String, required: true },
    blogId: { type: String },
    isRead: { type: Boolean, default: false },
    targetAudience: { type: String, default: 'all' },
  },
  { timestamps: true }
)

export const NotificationModel = models.Notification || mongoose.model("Notification", NotificationSchema)
