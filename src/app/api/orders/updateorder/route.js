import Order from "@/models/orderModel";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/userModel";

// For User
export const PATCH = async (req) => {
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

    const user = await User.findById(jwtData?.id);
    if (!user || user.role != "client")
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });

    const order = await Order.findById(id);
    if (meal != "guest") {
      order[meal] = state;
      await order.save();
    } else {
      if (!state) {
        order.isGuestMeal = false;
        order.guestBreakfastCount = 0;
        order.guestLunchCount = 0;
        order.guestDinnerCount = 0;
      } else {
        order.isGuestMeal = state;
        order.guestBreakfastCount = guestBreakfastCount;
        order.guestLunchCount = guestLunchCount;
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

// For Manager
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

    const manager = await User.findById(jwtData?.id);
    if (!manager || manager.role != "manager")
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });

    const order = await Order.findById(id);
    console.log(order);
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
