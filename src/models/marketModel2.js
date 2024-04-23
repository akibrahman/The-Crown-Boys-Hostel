import mongoose from "mongoose";

const marketSchema2 = new mongoose.Schema({
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

delete mongoose.models.tempmarkets;
const Market2 = mongoose.model("tempmarkets", marketSchema2);

export default Market2;
