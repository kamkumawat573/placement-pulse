import mongoose, { Schema, models } from "mongoose"

const ContactMessageSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    company: { type: String },
    message: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['new', 'read', 'replied', 'closed'], 
      default: 'new' 
    },
    priority: { 
      type: String, 
      enum: ['low', 'medium', 'high', 'urgent'], 
      default: 'medium' 
    },
    adminNotes: { type: String },
    repliedAt: { type: Date },
    closedAt: { type: Date },
    ipAddress: { type: String },
    userAgent: { type: String }
  },
  { timestamps: true }
)

export const ContactMessageModel = models.ContactMessage || mongoose.model("ContactMessage", ContactMessageSchema)
