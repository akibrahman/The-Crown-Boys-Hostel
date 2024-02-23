import Order from "@/models/orderModel";
import { NextResponse } from "next/server";

export const PATCH = async (req) => {
  try {
    const { meal, state, id } = await req.json();
    const order = await Order.findById(id);
    order[meal] = state;
    await order.save();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
};
