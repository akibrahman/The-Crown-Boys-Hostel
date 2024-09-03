import Order from "@/models/orderModel";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import moment from "moment";
import { cookies } from "next/headers";
import User from "@/models/userModel";

export const PUT = async (req) => {
  try {
    const token = cookies()?.get("token")?.value;
    try {
      jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (error) {
      console.log("============>", error);
      if (error.message == "invalid token" || "jwt malformed") {
        cookies().delete("token");
      }
      return NextResponse.json({ msg: "Unauthorized", error }, { status: 400 });
    }
    //
    const { data, userId, fromDate, toDate, fromDay, toDay } = await req.json();
    if (Object.keys(data).length == 0) {
      return NextResponse.json({ success: false, code: 111 });
    }
    const user = await User.findById(userId);
    if (!User) throw new Error("User not found");
    if (user?.blockDate) {
      if (
        moment(user.blockDate).isBetween(moment(fromDate), moment(toDate)) ||
        moment(user.blockDate).isBefore(moment(fromDate)) ||
        moment(user.blockDate).isBefore(moment(toDate))
      ) {
        throw new Error(
          `You are Blocked from ${new Date(user.blockDate).toDateString()}`
        );
      }
    }
    for (let i = fromDay; i <= toDay; i++) {
      const order = await Order.findOne({
        userId,
        date: fromDate.split("/")[0] + "/" + i + "/" + fromDate.split("/")[2],
      });
      if (!order) continue;
      if (Object.keys(data).includes("breakfast"))
        order.breakfast = data.breakfast;
      if (Object.keys(data).includes("lunch")) order.lunch = data.lunch;
      if (Object.keys(data).includes("dinner")) order.dinner = data.dinner;
      await order.save();
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("===========>", error);
    return NextResponse.json(
      { success: false, msg: error?.message || "Backend Error", error },
      { status: 500 }
    );
  }
};
