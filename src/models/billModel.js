import mongoose from "mongoose";

const billSchema = new mongoose.Schema({
  userId: {
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
  totalBreakfast: {
    type: Number,
    default: 0,
  },
  totalLunch: {
    type: Number,
    default: 0,
  },
  totalDinner: {
    type: Number,
    default: 0,
  },
  totalBillInBDT: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    default: "initiated",
  },
  isRentPaid: {
    type: Boolean,
    default: false,
  },
  charges: {
    type: [{}],
    default: [],
  },
});

delete mongoose.models.bills;
const Bill = mongoose.model("bills", billSchema);

export default Bill;
