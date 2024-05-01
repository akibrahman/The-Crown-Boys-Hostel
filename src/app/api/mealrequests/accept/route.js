import { dbConfig } from "@/dbConfig/dbConfig";
import MealRequest from "@/models/mealRequestModel";
import Order from "@/models/orderModel";
import { NextResponse } from "next/server";

await dbConfig();

export const POST = async (req) => {
  try {
    const { orderId, reqId, reqData } = await req.json();
    const order = await Order.findById(orderId);
    const request = await MealRequest.findById(reqId);
    order.isRequested = false;
    if (reqData.includes("breakfast")) order.breakfast = !order.breakfast;
    if (reqData.includes("lunch")) order.lunch = !order.lunch;
    if (reqData.includes("dinner")) order.dinner = !order.dinner;
    request.isResponded = true;
    request.isAccepted = true;
    request.isDeclined = false;
    await order.save();
    await request.save();
    return NextResponse.json({ msg: "Acception successfully", success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: error.message, success: false });
  }
};
