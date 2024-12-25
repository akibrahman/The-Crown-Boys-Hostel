import Order from "@/models/orderModel";
import { NextResponse } from "next/server";
const { dbConfig } = require("@/dbConfig/dbConfig");

dbConfig();

export const POST = async (req) => {
  try {
    // const { searchParams } = new URL(req.url);
    const data = await req.json();
    const yesterday = data.yesterday;
    const today = data.today;
    const tomorrow = data.tomorrow;
    const custom = data.custom;

    const dateConditions = [];
    if (yesterday) dateConditions.push({ date: yesterday });
    if (today) dateConditions.push({ date: today });
    if (tomorrow) dateConditions.push({ date: tomorrow });
    if (custom) dateConditions.push({ date: custom });

    const orders = await Order.aggregate([
      {
        $match: {
          $and: [
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
