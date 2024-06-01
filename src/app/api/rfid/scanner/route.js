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
    if (!cardId || !meal || !date || !month || !year)
      return NextResponse.json({ success: false, msg: "Missing Information" });
    const dataBaseCard = await RFID.findOne({ cardId });
    if (!dataBaseCard)
      return NextResponse.json({ success: false, msg: "Invalid Card" });
    if (!dataBaseCard.userId)
      return NextResponse.json({ success: false, msg: "Unregistered Card" });
    const orderDate = month + "/" + date + "/" + year;
    const order = await Order.findOne({
      userId: dataBaseCard.userId,
      date: orderDate,
    });
    const user = await User.findById(dataBaseCard.userId);
    if (!order)
      return NextResponse.json({ success: false, msg: "No Order Found" });
    const mealMappingForGuestMealCount = {
      breakfast: "guestBreakfastCount",
      lunch: "guestLunchCount",
      dinner: "guestDinnerCount",
    };
    const mealPropertyForGuestMeal =
      mealMappingForGuestMealCount[meal.toLowerCase()];
    const isMeal = order[meal] || order[mealPropertyForGuestMeal] > 0;
    const count = order[mealPropertyForGuestMeal] + (order[meal] ? 1 : 0);
    if (!isMeal)
      return NextResponse.json({
        isMeal,
        data: [order[meal], order[mealPropertyForGuestMeal]],
        success: false,
        msg: "You Haven't Order Meal",
      });
    return NextResponse.json({
      isMeal,
      count,
      msg: "Enjoy Your Meal",
      name: user.username,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
};
