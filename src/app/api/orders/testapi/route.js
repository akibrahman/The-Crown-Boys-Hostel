import Bill from "@/models/billModel";
import Market from "@/models/marketModel";
import Order from "@/models/orderModel";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import { decode } from "jsonwebtoken";
import { NextResponse } from "next/server";

export const POST = async () => {
  try {
    await Order.deleteMany({
      userId: "663916d667e9d16d56add11d",
      month: "July",
      year: 2024,
    });
    await Bill.deleteMany({
      userId: "663916d667e9d16d56add11d",
      month: "July",
      year: 2024,
    });
    // await User.findByIdAndUpdate("", {
    //   isClientVerified: false,
    // });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { msg: "Backend Error", error, success: false },
      { status: 500 }
    );
  }
};
// Blank All PP, NID & BC
export const PUT = async (req) => {
  try {
    // await User.updateMany({
    //   profilePicture: "/__",
    //   birthCertificatePicture: "/__",
    //   nidFrontPicture: "/__",
    //   nidBackPicture: "/__",
    //   idPicture: "/__",
    // });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
};

async function delay(s) {
  await new Promise((resolve) => setTimeout(resolve, s * 1000));
  console.log("Delayed function executed!!!!");
}
