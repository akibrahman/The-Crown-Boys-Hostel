import { dbConfig } from "@/dbConfig/dbConfig";
import Order from "@/models/orderModel";
import { NextResponse } from "next/server";

await dbConfig();

export const GET = async (req) => {
  // try {
  //   const { searchParams } = new URL(req.url);
  //   const cardId = searchParams.get("cardId");
  //   const meal = searchParams.get("meal");
  //   const date = searchParams.get("date");
  //   const month = searchParams.get("month");
  //   const year = searchParams.get("year");
  //   if (!cardId || !meal || !date || !month || !year) {
  //     return NextResponse.json({ success: false, msg: "Missing Information" });
  //   }
  //   // RFID Card
  //   const dataBaseCard = await RFID.findOne({ cardId }).lean();

  //   if (!dataBaseCard) {
  //     return NextResponse.json({ success: false, msg: "Invalid Card" });
  //   }
  //   if (!dataBaseCard.userId) {
  //     return NextResponse.json({ success: false, msg: "Unregistered Card" });
  //   }
  //   // Order Date From Request
  //   const orderDate = `${month}/${date}/${year}`;
  //   // Order And User Finding
  //   const [order, user] = await Promise.all([
  //     Order.findOne({
  //       userId: dataBaseCard.userId,
  //       date: orderDate,
  //     }).lean(),
  //     User.findById(dataBaseCard.userId).lean(),
  //   ]);
  //   if (!order) {
  //     return NextResponse.json({ success: false, msg: "No Order Found" });
  //   }
  //   const mealMappingForGuestMealCount = {
  //     breakfast: "guestBreakfastCount",
  //     lunch: "guestLunchCount",
  //     dinner: "guestDinnerCount",
  //   };
  //   const mealPropertyForGuestMeal =
  //     mealMappingForGuestMealCount[meal.toLowerCase()];
  //   const isMealOrdered = order[meal] || order[mealPropertyForGuestMeal] > 0;
  //   const mealCount = order[mealPropertyForGuestMeal] + (order[meal] ? 1 : 0);
  //   if (!isMealOrdered) {
  //     return NextResponse.json({
  //       isMeal: false,
  //       success: false,
  //       msg: "No Ordered Meal",
  //     });
  //   }
  //   return NextResponse.json({
  //     isMeal: true,
  //     count: mealCount,
  //     msg: "Enjoy Your Meal",
  //     name: user?.username || "Guest",
  //     success: true,
  //   });
  // }
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const month = searchParams.get("month");
    const year = searchParams.get("year");
    const cardId = searchParams.get("cardId");
    const meal = searchParams.get("meal");
    // const authorizedcode = searchParams.get("authorizedcode");
    // const machineuid = searchParams.get("machineuid");

    if (!meal || !cardId || !date || !month || !year) {
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
        $match: {
          "rfidData.cardId": cardId.toUpperCase(),
        },
      },
      {
        $project: {
          name: "$userData.username",
          cardId: "$rfidData.cardId",
          isBreakfastScanned: 1,
          isLunchScanned: 1,
          isDinnerScanned: 1,
          breakfast: {
            $add: [
              { $cond: [{ $eq: ["$breakfast", true] }, 1, 0] },
              "$guestBreakfastCount",
            ],
          },
          lunch: {
            $add: [
              { $cond: [{ $eq: ["$lunch", true] }, 1, 0] },
              "$guestLunchCount",
            ],
          },
          dinner: {
            $add: [
              { $cond: [{ $eq: ["$dinner", true] }, 1, 0] },
              "$guestDinnerCount",
            ],
          },
        },
      },
    ]);
    let isScanned =
      dataArray.length > 0
        ? meal == "breakfast"
          ? dataArray[0].isBreakfastScanned || false
          : meal == "lunch"
          ? dataArray[0].isLunchScanned || false
          : meal == "dinner"
          ? dataArray[0].isDinnerScanned || false
          : false
        : false;

    if (dataArray.length > 0) {
      meal == "breakfast"
        ? await Order.findByIdAndUpdate(dataArray[0]._id, {
            isBreakfastScanned: true,
          })
        : meal == "lunch"
        ? await Order.findByIdAndUpdate(dataArray[0]._id, {
            isLunchScanned: true,
          })
        : meal == "dinner"
        ? await Order.findByIdAndUpdate(dataArray[0]._id, {
            isDinnerScanned: true,
          })
        : null;
    }

    return NextResponse.json({
      orderId: dataArray.length > 0 ? dataArray[0]._id : "null",
      isScanned,
      count:
        dataArray.length > 0
          ? meal == "breakfast" && dataArray[0].breakfast > 0
            ? dataArray[0].breakfast
            : meal == "lunch" && dataArray[0].lunch > 0
            ? dataArray[0].lunch
            : meal == "dinner" && dataArray[0].dinner > 0
            ? dataArray[0].dinner
            : 0
          : 0,
      msg:
        dataArray.length > 0
          ? meal == "breakfast" && dataArray[0].breakfast > 0
            ? isScanned != true
              ? "Enjoy Your Breakfast"
              : "Breakfast is Taken"
            : meal == "lunch" && dataArray[0].lunch > 0
            ? isScanned != true
              ? "Enjoy Your Lunch"
              : "Lunch is Taken"
            : meal == "dinner" && dataArray[0].dinner > 0
            ? isScanned != true
              ? "Enjoy Your Dinner"
              : "Dinner is Taken"
            : "No Ordered Meal"
          : "Unknown Card",
      name: dataArray.length > 0 ? dataArray[0].name : "Guest",
      success:
        dataArray.length > 0 &&
        ((meal == "breakfast" && dataArray[0].breakfast > 0) ||
          (meal == "lunch" && dataArray[0].lunch > 0) ||
          (meal == "dinner" && dataArray[0].dinner > 0)) &&
        dataArray[0]?.isScanned != true
          ? true
          : false,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};
