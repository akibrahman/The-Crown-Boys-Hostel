import { dbConfig } from "@/dbConfig/dbConfig";
import Order from "@/models/orderModel";
import RFID from "@/models/rfid";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

await dbConfig();

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const cardId = searchParams.get("cardId");
    const meal = searchParams.get("meal");
    const date = searchParams.get("date");
    const month = searchParams.get("month");
    const year = searchParams.get("year");
    if (!cardId || !meal || !date || !month || !year) {
      return NextResponse.json({ success: false, msg: "Missing Information" });
    }
    const dataBaseCard = await RFID.findOne({ cardId }).lean();
    if (!dataBaseCard) {
      return NextResponse.json({ success: false, msg: "Invalid Card" });
    }
    if (!dataBaseCard.userId) {
      return NextResponse.json({ success: false, msg: "Unregistered Card" });
    }
    const orderDate = `${month}/${date}/${year}`;
    const [order, user] = await Promise.all([
      Order.findOne({
        userId: dataBaseCard.userId,
        date: orderDate,
      }).lean(),
      User.findById(dataBaseCard.userId).lean(),
    ]);
    if (!order) {
      return NextResponse.json({ success: false, msg: "No Order Found" });
    }
    const mealMappingForGuestMealCount = {
      breakfast: "guestBreakfastCount",
      lunch: "guestLunchCount",
      dinner: "guestDinnerCount",
    };
    const mealPropertyForGuestMeal =
      mealMappingForGuestMealCount[meal.toLowerCase()];
    const isMealOrdered = order[meal] || order[mealPropertyForGuestMeal] > 0;
    const mealCount = order[mealPropertyForGuestMeal] + (order[meal] ? 1 : 0);
    if (!isMealOrdered) {
      return NextResponse.json({
        isMeal: false,
        success: false,
        msg: "No Ordered Meal",
      });
    }
    return NextResponse.json({
      isMeal: true,
      count: mealCount,
      msg: "Enjoy Your Meal",
      name: user?.username || "Guest",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};
