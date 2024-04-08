import Bill from "@/models/billModel";
import Order from "@/models/orderModel";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    console.log("Process Started");
    await Order.deleteMany({ userId: "" });
    await Bill.deleteOne({ userId: "" });
    return NextResponse.json({ msg: "OK", success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { msg: "Backend Error", error, success: false },
      { status: 500 }
    );
  }
};
