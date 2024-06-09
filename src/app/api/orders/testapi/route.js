import Bill from "@/models/billModel";
import Order from "@/models/orderModel";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

export const POST = async () => {
  try {
    await Order.deleteMany({ userId: "" });
    await Bill.deleteMany({ userId: "" });
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

export const PUT = async () => {
  try {
    const users = await User.find({});
    console.log(users);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { msg: "Backend Error", error, success: false },
      { status: 500 }
    );
  }
};
