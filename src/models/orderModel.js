import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  managerId: {
    type: String,
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  breakfast: {
    type: Boolean,
    required: true,
  },
  lunch: {
    type: Boolean,
    required: true,
  },
  dinner: {
    type: Boolean,
    required: true,
  },
  isGuestMeal: {
    type: Boolean,
    default: false,
  },
  isRequested: {
    type: Boolean,
  },
  guestBreakfastCount: {
    type: Number,
    default: 0,
  },
  guestLunchCount: {
    type: Number,
    default: 0,
  },
  guestDinnerCount: {
    type: Number,
    default: 0,
  },
  isBreakfastScanned: {
    type: Boolean,
    default: false,
  },
  isLunchScanned: {
    type: Boolean,
    default: false,
  },
  isDinnerScanned: {
    type: Boolean,
    default: false,
  },
});

delete mongoose.models.orders;
const Order = mongoose.model("orders", orderSchema);

export default Order;
