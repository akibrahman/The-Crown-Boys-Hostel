import { dbConfig } from "@/dbConfig/dbConfig";
import Order from "@/models/orderModel";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/userModel";

await dbConfig();

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const yesterday = searchParams.get("yesterday");
    const today = searchParams.get("today");
    const tomorrow = searchParams.get("tomorrow");
    const custom = searchParams.get("custom");

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

    const dateConditions = [];
    if (yesterday) dateConditions.push({ date: yesterday });
    if (today) dateConditions.push({ date: today });
    if (tomorrow) dateConditions.push({ date: tomorrow });
    if (custom) dateConditions.push({ date: custom });

    const orders = await Order.aggregate([
      {
        $match: {
          $and: [
            { managerId: jwtData.id.toString() },
            {
              $or: [
                { breakfast: true },
                { lunch: true },
                { dinner: true },
                { $expr: { $gt: ["$guestBreakfastCount", 0] } },
                { $expr: { $gt: ["$guestLunchCount", 0] } },
                { $expr: { $gt: ["$guestDinnerCount", 0] } },
              ],
            },
            dateConditions.length > 0 ? { $or: dateConditions } : {},
          ],
        },
      },
      {
        $addFields: {
          userIdObj: { $toObjectId: "$userId" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userIdObj",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
    ]);
    console.log(orders.length);
    return NextResponse.json({ success: true, msg: "All Orders Got", orders });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      msg: "Problem when All Orders Being Gottten",
      error,
    });
  }
};
