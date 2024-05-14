import mongoose from "mongoose";

const rfidSchema = new mongoose.Schema({
  cardId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    default: "",
  },
  createdAt: {
    type: String,
    required: true,
  },
  isIssued: {
    type: Boolean,
    default: false,
  },
});

delete mongoose.models.rfids;
const RFID = mongoose.model("rfids", rfidSchema);

export default RFID;
