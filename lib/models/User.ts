import mongoose, { Schema, models } from "mongoose"

const UserSchema = new Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    mobile: { type: String, unique: true, sparse: true },
    avatarUrl: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    zip: { type: String },
    enrolledCourses: [{ 
      courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
      enrolledAt: { type: Date, default: Date.now },
      progress: { type: Number, default: 0 },
      transactionId: { type: String },
      paymentId: { type: String },
      orderId: { type: String },
      status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' }
    }],
    // Keep for backward compatibility
    enrolledCourse: { type: Boolean, default: false },
    progress: { type: Number, default: 0 },
    transactionId: { type: String, default: null },
    bypassPayment: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export const UserModel = models.User || mongoose.model("User", UserSchema)


