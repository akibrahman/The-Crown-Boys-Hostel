import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Provide a Name"],
  },
  email: {
    type: String,
    required: [true, "Please Provide an E-mail"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Please Provide a Phone Number"],
  },
  isResponded: {
    type: Boolean,
    default: false,
  },
  beds: {
    type: [{}],
    default: [],
  },
});

delete mongoose.model.bookings;
const Booking = mongoose.model("bookings", bookingSchema);

export default Booking;
