import mongoose, { Document, Schema } from 'mongoose'

export interface GDTopic extends Document {
  title: string
  description: string
  category: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  tags: string[]
  discussionPoints: string[]
  tips: string[]
  relatedTopics: string[]
  imageUrl?: string
  isActive: boolean
  isTrending: boolean
  likes: number
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

const GDTopicSchema = new Schema<GDTopic>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Business', 'Technology', 'Social Issues', 'Economics', 'Politics', 'Environment', 'Education', 'Healthcare', 'Sports', 'Entertainment', 'General Knowledge']
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  tags: [{
    type: String,
    trim: true
  }],
  discussionPoints: [{
    type: String,
    trim: true
  }],
  tips: [{
    type: String,
    trim: true
  }],
  relatedTopics: [{
    type: String,
    trim: true
  }],
  imageUrl: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isTrending: {
    type: Boolean,
    default: false
  },
  likes: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

// Index for better performance
GDTopicSchema.index({ category: 1, isActive: 1, isTrending: 1 })
GDTopicSchema.index({ createdAt: -1 })

export default mongoose.models.GDTopic || mongoose.model<GDTopic>('GDTopic', GDTopicSchema)
