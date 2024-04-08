import mongoose from "mongoose";

const managerBillSchema = new mongoose.Schema({
  managerId: {
    type: String,
    required: true,
  },
  marketId: {
    type: String,
  },
  month: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  totalMarketAmountInBDT: {
    type: Number,
  },
  totalMeal: {
    type: Number,
  },
  mealRate: {
    type: Number,
  },
});

delete mongoose.models.managerBills;
const ManagerBill = mongoose.model("managerBills", managerBillSchema);

export default ManagerBill;
