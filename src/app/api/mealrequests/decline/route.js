import { dbConfig } from "@/dbConfig/dbConfig";
import MealRequest from "@/models/mealRequestModel";
import Order from "@/models/orderModel";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

await dbConfig();

export const POST = async (req) => {
  try {
    const { orderId, reqId } = await req.json();
    const order = await Order.findById(orderId);
    const request = await MealRequest.findById(reqId);
    const user = await User.findById(order.userId);
    const { contactNumber, username } = user;
    const message = `Hi ${username},\nYour meal change request has been declined\nDate: ${
      order.date
    }\nMeal: ${reqData
      .map((meal) => meal)
      .join(", ")}\n\nThe Crown Boys Hostel`;
    order.isRequested = false;
    request.isResponded = true;
    request.isAccepted = false;
    request.isDeclined = true;
    await order.save();
    await request.save();
    //! SMS
    const url = "http://bulksmsbd.net/api/smsapi";
    const apiKey = process.env.SMS_API_KEY;
    const senderId = "8809617618230";
    const numbers = contactNumber;
    const smsClientData = {
      api_key: apiKey,
      senderid: senderId,
      number: numbers,
      message: message,
    };
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(smsClientData),
    });
    //! SMS
    return NextResponse.json({ msg: "Declined successfully", success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: error.message, success: false });
  }
};
