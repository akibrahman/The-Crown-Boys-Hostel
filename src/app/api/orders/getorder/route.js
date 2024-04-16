import { dbConfig } from "@/dbConfig/dbConfig";
import Order from "@/models/orderModel";
import { NextResponse } from "next/server";

dbConfig();

export const POST = async (req) => {
  try {
    const { userId, date } = await req.json();
    console.log({ msg: "Order Changed" });
    const order = await Order.find({ userId, date });
    if (order.length > 0)
      return NextResponse.json({ msg: "OK", success: true, order: order[0] });
    else throw new Error("Order not found");
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: "Backend Error", error }, { status: 400 });
  }
};
