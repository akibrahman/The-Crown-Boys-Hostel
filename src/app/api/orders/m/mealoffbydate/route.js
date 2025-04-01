import Order from "@/models/orderModel";
import User from "@/models/userModel";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export const PUT = async (req) => {
  try {
    const { reqData, date, managerId } = await req.json();
    if (Object.keys(reqData).length == 0) {
      return NextResponse.json({ success: false, code: 111 });
    }

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
    if (!manager || manager.role !== "manager")
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });

    console.log(reqData);

    // Building update object dynamically
    const updateFields = {};
    if ("breakfast" in reqData) {
      updateFields.breakfast = reqData.breakfast;
      if (!reqData.breakfast) updateFields.guestBreakfastCount = 0;
    }
    if ("lunch" in reqData) {
      updateFields.lunch = reqData.lunch;
      if (!reqData.lunch) updateFields.guestLunchCount = 0;
    }
    if ("dinner" in reqData) {
      updateFields.dinner = reqData.dinner;
      if (!reqData.dinner) updateFields.guestDinnerCount = 0;
    }

    // If all are false, set isGuestmeal to false
    if (
      "breakfast" in reqData &&
      "lunch" in reqData &&
      "dinner" in reqData &&
      !reqData.breakfast &&
      !reqData.lunch &&
      !reqData.dinner
    ) {
      updateFields.isGuestmeal = false;
    }

    await Order.updateMany({ managerId, date }, { $set: updateFields });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
};
