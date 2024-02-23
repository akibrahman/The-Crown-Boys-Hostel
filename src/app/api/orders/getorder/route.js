import Order from "@/models/orderModel";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const { userId, date } = await req.json();
    const order = await Order.find({ userId, date });
    return NextResponse.json({ msg: "OK", success: true, order: order[0] });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: "Backend Error", error }, { status: 500 });
  }
};
