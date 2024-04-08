import { dbConfig } from "@/dbConfig/dbConfig";
import Order from "@/models/orderModel";
import { NextResponse } from "next/server";

dbConfig();

export const POST = async (req) => {
  try {
    const { managerId, month, year } = await req.json();
    const orders = await Order.find({ managerId, month, year });
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
};
