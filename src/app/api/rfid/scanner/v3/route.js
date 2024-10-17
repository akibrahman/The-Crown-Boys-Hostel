import { dbConfig } from "@/dbConfig/dbConfig";
import Order from "@/models/orderModel";
import { NextResponse } from "next/server";

await dbConfig();

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const month = searchParams.get("month");
    const year = searchParams.get("year");
    const authorizedcode = searchParams.get("authorizedcode");
    const machineuid = searchParams.get("machineuid");

    if (!authorizedcode || !machineuid || !date || !month || !year) {
      return NextResponse.json({
        success: false,
        msg: "Unauthorized || Missing Information",
      });
    }

    const orderDate = `${month}/${date}/${year}`;

    const dataArray = await Order.aggregate([
      {
        $addFields: {
          userIdObj: { $toObjectId: "$userId" },
        },
      },
      {
        $match: {
          date: orderDate,
        },
      },
      {
        $lookup: {
          from: "rfids",
          localField: "userId",
          foreignField: "userId",
          as: "rfidData",
        },
      },

      {
        $unwind: "$rfidData",
      },
      {
        $lookup: {
          from: "users",
          localField: "userIdObj",
          foreignField: "_id",
          as: "userData",
        },
      },
      {
        $unwind: "$userData",
      },
      {
        $project: {
          name: "$userData.username", // Name from User
          cardId: "$rfidData.cardId", // CardId from RFID
          breakfast: {
            $add: [
              { $cond: [{ $eq: ["$breakfast", true] }, 1, 0] },
              "$guestBreakfastCount",
            ],
          }, // Convert boolean to 1/0 and add guest count
          lunch: {
            $add: [
              { $cond: [{ $eq: ["$lunch", true] }, 1, 0] },
              "$guestLunchCount",
            ],
          }, // Convert boolean to 1/0 and add guest count
          dinner: {
            $add: [
              { $cond: [{ $eq: ["$dinner", true] }, 1, 0] },
              "$guestDinnerCount",
            ],
          }, // Convert boolean to 1/0 and add guest count
        },
      },
    ]);

    return NextResponse.json(dataArray);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};
