import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: "",
  },
  billId: {
    type: String,
    default: "",
  },
  note: {
    type: String,
    default: "",
  },
  reason: {
    type: String,
    default: "",
  },
  coupon: {
    type: String,
    default: "",
  },
  reference: {
    type: String,
    default: "",
  },
  transactionId: {
    type: String,
    default: "",
  },
  bKashTransactionId: {
    type: String,
    default: "",
  },
  transactionDate: {
    type: String,
    default: "",
  },
  method: {
    type: String,
    default: "",
  },
  tax: {
    type: Number,
    default: 0,
  },
  payments: {
    type: [{ name: String, value: Number }],
    default: [],
  },
});

delete mongoose.models.transactions;
const Transaction = mongoose.model("transactions", transactionSchema);

export default Transaction;
