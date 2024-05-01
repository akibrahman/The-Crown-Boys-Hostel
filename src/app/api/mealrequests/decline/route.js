import { dbConfig } from "@/dbConfig/dbConfig";
import MealRequest from "@/models/mealRequestModel";
import Order from "@/models/orderModel";
import { NextResponse } from "next/server";

await dbConfig();

export const POST = async (req) => {
  try {
    const { orderId, reqId } = await req.json();
    const order = await Order.findById(orderId);
    const request = await MealRequest.findById(reqId);
    order.isRequested = false;
    request.isResponded = true;
    request.isAccepted = false;
    request.isDeclined = true;
    await order.save();
    await request.save();
    return NextResponse.json({ msg: "Declined successfully", success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: error.message, success: false });
  }
};
