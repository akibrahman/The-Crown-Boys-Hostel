import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  name: String,
  video: { src: String, path: String },
  block: String,
  type: String,
  sketch: { src: String, path: String },
  floor: Number,
  image: { src: String, path: String },
  seats: Number,
  toilet: { toiletType: String, image: { src: String, path: String } },
  balcony: { balconyState: Boolean, image: { src: String, path: String } },
  beds: [
    {
      user: String,
      userRent: Number,
      displayRent: Number,
      bookingCharge: Number,
      bedNo: String,
      isBooked: Boolean,
      image: { src: String, path: String },
    },
  ],
});

delete mongoose.models.rooms;
const Room = mongoose.model("rooms", roomSchema);

export default Room;
