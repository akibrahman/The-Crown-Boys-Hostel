import { dbConfig } from "@/dbConfig/dbConfig";
import Order from "@/models/orderModel";
import User from "@/models/userModel";
import jwt from "jsonwebtoken";
// import moment from "moment";
import moment from "moment-timezone";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

dbConfig();

export const POST = async (req) => {
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
    const { userId, date } = await req.json();
    const user = await User.findById(userId);
    if (!User) throw new Error("User not found");
    console.log(user.blockDate);
    console.log(date);
    if (user?.blockDate) {
      const blockDateBD = moment
        .tz(user.blockDate, "Asia/Dhaka")
        .startOf("day");
      const currentDateBD = moment.tz(date, "Asia/Dhaka").startOf("day");

      if (blockDateBD.isBefore(currentDateBD)) {
        throw new Error(
          `You are Blocked from ${new Date(user.blockDate).toDateString()}`
        );
      }
    }
    const order = await Order.findOne({ userId, date });
    if (order) return NextResponse.json({ msg: "OK", success: true, order });
    else {
      throw new Error("Order not found");
    }
  } catch (error) {
    return NextResponse.json(
      { msg: error?.message || "Backend Error" },
      { status: 400 }
    );
  }
};
