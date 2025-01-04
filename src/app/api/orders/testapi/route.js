import MonthlyBillEmail from "@/Components/MonthlyBillEmail/MonthlyBillEmail";
import ForgotEmail from "@/Components/VerificationEmail/ForgotEmail";
import Bill from "@/models/billModel";
import Order from "@/models/orderModel";
import Transaction from "@/models/transactionModel";
import User from "@/models/userModel";
import { sendSMS } from "@/utils/sendSMS";
import { render } from "@react-email/render";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const POST = async () => {
  try {
    await Order.deleteMany({
      userId: "",
      month: "January",
      year: 2025,
    });
    await Bill.deleteMany({
      userId: "",
      month: "January",
      year: 2025,
    });
    await User.findByIdAndUpdate("", {
      isClientVerified: false,
    });
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
    return NextResponse.json({ success: true, msg: "Done" });
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
