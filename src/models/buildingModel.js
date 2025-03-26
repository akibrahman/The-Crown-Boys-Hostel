import mongoose from "mongoose";

const buildingSchema = new mongoose.Schema({
  managerId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    default: "",
  },
  floorsCount: {
    type: Number,
    default: 5,
  },
  sqFt: {
    type: Number,
    default: 500,
  },
});

delete mongoose.models.buildings;
const Building = mongoose.model("buildings", buildingSchema);

export default Building;
