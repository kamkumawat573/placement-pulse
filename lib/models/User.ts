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
    enrolledCourse: { type: Boolean, default: false },
    progress: { type: Number, default: 0 },
    transactionId: { type: String, default: null },
    bypassPayment: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export const UserModel = models.User || mongoose.model("User", UserSchema)


