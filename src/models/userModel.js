import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please Provide a UserName"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please Provide an Email"],
    unique: true,
  },
  contactNumber: {
    type: Number,
    required: [true, "Please Provide a Contact Number"],
  },
  profilePicture: {
    type: String,
    required: [true, "Please Provide a Profile Picture"],
  },
  password: {
    type: String,
    required: [true, "Please Provide a Password"],
  },
  role: {
    type: String,
    required: [true, "Please Provide a role"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isManager: {
    type: Boolean,
    default: false,
  },
  isClient: {
    type: Boolean,
    default: false,
  },
  messAddress: String,
  bkashNumber: Number,
  manager: String,
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
});

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;
