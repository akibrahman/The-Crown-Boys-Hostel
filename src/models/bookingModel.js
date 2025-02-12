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
  isPaid: {
    type: Boolean,
    default: false,
  },
  bookingTime: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  checkIn: {
    type: String,
    required: true,
  },
  transactionId: {
    type: String,
    default: "",
  },
  beds: {
    type: [{}],
    default: [],
  },
});

const Booking =
  mongoose.models.bookings || mongoose.model("bookings", bookingSchema);

export default Booking;
