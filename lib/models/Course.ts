import mongoose, { Schema, models } from 'mongoose';

const CourseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
      required: true,
    },
    discount: {
      type: String,
      default: "50% OFF",
    },
    duration: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Beginner to Advanced', 'Intermediate to Advanced'],
      default: 'Beginner',
    },
    students: {
      type: String,
      default: "0+",
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    reviews: {
      type: String,
      default: "0",
    },
    category: {
      type: String,
      required: true,
    },
    instructor: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
    },
    features: [{
      type: String,
    }],
    modules: [{
      week: String,
      title: String,
      lessons: String,
      duration: String,
    }],
    testimonials: [{
      name: String,
      role: String,
      content: String,
      rating: Number,
      avatar: String,
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

// Clear the existing model to avoid conflicts
if (mongoose.models.Course) {
  delete mongoose.models.Course;
}

export const CourseModel = mongoose.model('Course', CourseSchema);
