import Order from "@/models/orderModel";
import { NextResponse } from "next/server";

export const GET = async () => {
  await Order.deleteMany({ month: "March" });
  return NextResponse.json({ msg: "OK" });
};
