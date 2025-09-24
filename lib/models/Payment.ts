import mongoose, { Schema, models } from "mongoose"

const PaymentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    email: { type: String, index: true },
    orderId: { type: String, required: true, index: true },
    paymentId: { type: String, required: true, unique: true },
    signature: { type: String, required: true },
    amount: { type: Number },
    currency: { type: String },
    status: { type: String },
    method: { type: String },
    notes: { type: Schema.Types.Mixed },
    raw: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
)

export const PaymentModel = models.Payment || mongoose.model("Payment", PaymentSchema)


