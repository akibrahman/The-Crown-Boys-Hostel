import { dbConfig } from "@/dbConfig/dbConfig";
import Order from "@/models/orderModel";
import { NextResponse } from "next/server";

dbConfig();

export const POST = async (req) => {
  try {
    const {
      userId,
      managerId,
      days,
      currentMonthName,
      currentMonth,
      currentYear,
    } = await req.json();
    for (let i = 1; i <= days; i++) {
      const newOrder = new Order({
        userId,
        managerId,
        month: currentMonthName,
        year: currentYear,
        date: new Date(currentYear, currentMonth, i).toLocaleDateString(),
        breakfast: false,
        lunch: false,
        dinner: false,
      });
      await newOrder.save();
    }
    return NextResponse.json({ msg: "OK" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: "Error", error });
  }
};
