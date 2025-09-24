import mongoose, { Schema, models } from 'mongoose';

const PriceHistorySchema = new Schema(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    oldPrice: {
      type: Number,
      required: true,
    },
    newPrice: {
      type: Number,
      required: true,
    },
    oldOriginalPrice: {
      type: Number,
    },
    newOriginalPrice: {
      type: Number,
    },
    oldDiscount: {
      type: String,
    },
    newDiscount: {
      type: String,
    },
    changedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
    changeReason: {
      type: String,
      default: 'Price update',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Clear the existing model to avoid conflicts
if (mongoose.models.PriceHistory) {
  delete mongoose.models.PriceHistory;
}

export const PriceHistoryModel = mongoose.model('PriceHistory', PriceHistorySchema);
