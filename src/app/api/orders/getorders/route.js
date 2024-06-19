import { dbConfig } from "@/dbConfig/dbConfig";
import Bill from "@/models/billModel";
import Order from "@/models/orderModel";
import { NextResponse } from "next/server";

dbConfig();

export const POST = async (req) => {
  try {
    const { userId, month, year } = await req.json();
    const orders = await Order.find({ userId, month, year });
    const bill = await Bill.findOne({ userId, month });
    return NextResponse.json({ success: true, orders, bill });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
};
