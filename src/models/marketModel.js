import mongoose from "mongoose";

const marketSchema = new mongoose.Schema({
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
  data: {
    type: [
      {
        date: String,
        amount: Number,
      },
    ],
  },
});

delete mongoose.models.markets;
const Market = mongoose.model("markets", marketSchema);

export default Market;
