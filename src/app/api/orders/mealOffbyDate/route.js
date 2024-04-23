import Order from "@/models/orderModel";
import { NextResponse } from "next/server";

export const PUT = async (req) => {
  try {
    const { reqData, date, managerId } = await req.json();
    if (Object.keys(reqData).length == 0) {
      return NextResponse.json({ success: false, code: 111 });
    }
    await Order.updateMany({ managerId, date }, reqData);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("===========>", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
};
