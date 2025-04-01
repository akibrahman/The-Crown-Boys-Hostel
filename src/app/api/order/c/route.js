import { dbConfig } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Order from "@/models/orderModel";
import { NextResponse } from "next/server";

await dbConfig();

export const GET = async (req) => {
  try {
    //! Authorization
    const token = cookies()?.get("token")?.value;
    let jwtData;
    try {
      jwtData = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (error) {
      console.log(error);
      if (error.message == "invalid token" || "jwt malformed") {
        cookies().delete("token");
      }
      return NextResponse.json({ msg: "Unauthorized", error }, { status: 401 });
    }

    //! Request
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    if (!date) throw new Error("Missing Data");

    const user = await User.findById(jwtData?.id);
    if (!user) throw new Error("User not found");

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
    const order = await Order.findOne({ userId: jwtData?.id, date });
    if (!order) throw new Error("Order not found");

    //! Response
    return NextResponse.json({
      msg: "Order Fetched Successfully",
      success: true,
      order,
    });
  } catch (error) {
    return NextResponse.json(
      { msg: error?.message || "Backend Error" },
      { status: 400 }
    );
  }
};

export const PUT = async (req) => {
  try {
    const {
      meal,
      id,
      state,
      guestBreakfastCount,
      guestLunchCount,
      guestDinnerCount,
    } = await req.json();

    if (!meal || !id || state == null || state == undefined)
      throw new Error("Missing Data Stage 1");
    if (
      meal == "guest" &&
      state &&
      !guestBreakfastCount &&
      !guestLunchCount &&
      !guestDinnerCount
    )
      throw new Error("Missing Data Stage 2");

    const token = cookies()?.get("token")?.value;
    let jwtData;
    try {
      jwtData = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (error) {
      console.log(error);
      if (error.message == "invalid token" || "jwt malformed") {
        cookies().delete("token");
      }
      return NextResponse.json({ msg: "Unauthorized", error }, { status: 401 });
    }

    const order = await Order.findById(id);
    if (!order || order.userId != jwtData?.id)
      throw new Error("Order Not Found");

    if (meal != "guest") {
      order[meal] = state;
      if (state == true) {
        if (meal == "breakfast") order.isBreakfastScanned = false;
        else if (meal == "lunch") order.isLunchScanned = false;
        if (meal == "dinner") order.isDinnerScanned = false;
      }
      await order.save();
    } else {
      if (!state) {
        order.isGuestMeal = false;
        order.guestBreakfastCount = 0;
        order.guestLunchCount = 0;
        order.guestDinnerCount = 0;
      } else {
        //
        order.isGuestMeal = state;
        if (order.guestBreakfastCount != guestBreakfastCount)
          order.isBreakfastScanned = false;
        order.guestBreakfastCount = guestBreakfastCount;
        if (order.guestLunchCount != guestLunchCount)
          order.isLunchScanned = false;
        order.guestLunchCount = guestLunchCount;
        if (order.guestDinnerCount != guestDinnerCount)
          order.isDinnerScanned = false;
        order.guestDinnerCount = guestDinnerCount;
      }
      await order.save();
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
};
