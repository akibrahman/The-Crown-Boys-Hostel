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
            { $or: [{ date: yesterday }, { date: today }, { date: tomorrow }] },
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
