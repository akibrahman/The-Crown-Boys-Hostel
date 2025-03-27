import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  name: String,
  video: String,
  block: String,
  building: String,
  type: String,
  sketch: String,
  floor: Number,
  image: String,
  seats: Number,
  toilet: { toiletType: String, image: String },
  balcony: { balconyState: Boolean, image: String },
  beds: [
    {
      user: String,
      userRent: Number,
      displayRent: Number,
      bookingCharge: Number,
      bedNo: String,
      isBooked: Boolean,
      image: String,
      top: String,
      left: String,
    },
  ],
});

delete mongoose.models.rooms;
const Room = mongoose.model("rooms", roomSchema);

export default Room;
