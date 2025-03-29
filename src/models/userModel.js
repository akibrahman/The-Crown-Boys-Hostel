import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please Provide a UserName"],
  },
  email: {
    type: String,
    required: [true, "Please Provide an Email"],
    unique: true,
  },
  contactNumber: {
    type: String,
    required: [true, "Please Provide a Contact Number"],
  },
  fathersNumber: {
    type: String,
    required: [true, "Please Provide a Father's Number"],
  },
  mothersNumber: {
    type: String,
    required: [true, "Please Provide a Mother's Number"],
  },
  profilePicture: {
    type: String,
    required: [true, "Please Provide a Profile Picture"],
  },
  idPicture: {
    type: String,
    default: "",
  },
  birthCertificatePicture: {
    type: String,
    default: "",
  },
  nidFrontPicture: {
    type: String,
    default: "",
  },
  nidBackPicture: {
    type: String,
    default: "",
  },
  password: {
    type: String,
    required: [true, "Please Provide a Password"],
  },
  role: {
    type: String,
    required: [true, "Please Provide a role"],
  },
  fcm: {
    type: String,
    default: "",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isManager: {
    type: Boolean,
    default: false,
  },
  isManagerVerified: {
    type: Boolean,
    default: false,
  },
  isClient: {
    type: Boolean,
    default: false,
  },
  isClientVerified: {
    type: Boolean,
    default: false,
  },
  blockDate: { type: String, default: "" },
  charges: {
    type: [{}],
    default: [],
  },
  files: {
    type: [{ path: String, link: String, fileType: String }],
    default: [],
  },
  nidAuth: { type: Boolean, default: true },
  floor: { type: Number, default: 0 },
  roomNumber: { type: String, default: "" },
  studentId: { type: String, default: "" },
  bloodGroup: { type: String, default: "" },
  institution: { type: String, default: "" },
  messAddress: { type: String, default: "" },
  bkashNumber: { type: String, default: "" },
  manager: { type: String, default: "" },
  forgotPasswordToken: { type: String, default: "" },
  forgotPasswordTokenExpiry: Date,
  verifyToken: { type: String, default: "" },
  verifyTokenExpiry: Date,
});

delete mongoose.models.users;
const User = mongoose.model("users", userSchema);

export default User;
