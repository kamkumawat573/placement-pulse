import mongoose, { Schema, models } from "mongoose"

const BlogSchema = new Schema(
  {
    blogId: { type: String, unique: true, required: true },
    title: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    category: { type: String },
    tags: [{ type: String }],
    coverImage: { type: String },
    author: { type: String, default: 'Admin' },
    isVisible: { type: Boolean, default: true },
    // Keep legacy fields for backward compatibility
    caption: { type: String },
    imageUrl: { type: String },
    highlightedText: { type: String },
    highlightType: { 
      type: String, 
      enum: ['none', 'important', 'warning', 'success', 'info', 'quote'],
      default: 'none'
    },
  },
  { timestamps: true }
)

export const BlogModel = models.Blog || mongoose.model("Blog", BlogSchema)


