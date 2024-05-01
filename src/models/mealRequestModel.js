import mongoose from "mongoose";

const mealRequestSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  breakfast: {
    type: Boolean,
  },
  lunch: {
    type: Boolean,
  },
  dinner: {
    type: Boolean,
  },
  isResponded: {
    type: Boolean,
    default: false,
  },
  isAccepted: {
    type: Boolean,
    default: false,
  },
  isDeclined: {
    type: Boolean,
    default: false,
  },
  reason: {
    type: String,
    required: true,
  },
});

delete mongoose.models.meal_requests;
const MealRequest = mongoose.model("meal_requests", mealRequestSchema);

export default MealRequest;
