import mongoose from "mongoose";

const subSchemaForData = new mongoose.Schema({
  date: String,
  amount: Number,
});
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
    type: [subSchemaForData],
  },
});

delete mongoose.models.markets;
const Market = mongoose.model("markets", marketSchema);

export default Market;
