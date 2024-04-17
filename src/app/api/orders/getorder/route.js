import { dbConfig } from "@/dbConfig/dbConfig";
import Order from "@/models/orderModel";
import { NextResponse } from "next/server";

dbConfig();

export const POST = async (req) => {
  try {
    const { userId, date } = await req.json();
    console.log({ msg: "Order Changed" });
    const order = await Order.findOne({ userId, date });
    if (order) return NextResponse.json({ msg: "OK", success: true, order });
    else {
      console.log("++=>", order, userId, date);
      throw new Error("Order not found");
    }
  } catch (error) {
    return NextResponse.json({ msg: "Backend Error", error }, { status: 400 });
  }
};
