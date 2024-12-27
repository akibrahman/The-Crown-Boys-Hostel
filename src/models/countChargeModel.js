import mongoose from "mongoose";

const countChargeSchema = new mongoose.Schema({
  userId: String,
  note: String,
  amount: Number,
  count: Number,
});

const CountCharge =
  mongoose.models.countcharges ||
  mongoose.model("countcharges", countChargeSchema);

export default CountCharge;
