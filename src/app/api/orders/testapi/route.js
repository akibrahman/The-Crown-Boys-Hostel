import Bill from "@/models/billModel";
import Order from "@/models/orderModel";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

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

export const PATCH = async () => {
  try {
    await Bill.updateMany(
      { month: "November", year: 2024 },
      {
        $push: {
          charges: {
            $each: [
              { note: "Special Meal", amount: 66 },
              { note: "Special Meal", amount: 66 },
            ],
          },
        },
        $inc: { totalBillInBDT: 132 },
      }
    );
    return NextResponse.json(
      { success: true, msg: "Runned Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, error: error?.message },
      { status: 500 }
    );
  }
};
