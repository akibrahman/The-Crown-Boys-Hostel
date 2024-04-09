import { dbConfig } from "@/dbConfig/dbConfig";
import Bill from "@/models/billModel";
import Order from "@/models/orderModel";
import { NextResponse } from "next/server";

dbConfig();

export const POST = async (req) => {
  try {
    const {
      userId,
      managerId,
      days,
      currentDateNumber,
      currentMonthName,
      currentMonth,
      currentYear,
    } = await req.json();
    // console.log("--------------------------------");
    // console.log(userId);
    // console.log(managerId);
    // console.log(days);
    // console.log(currentDateNumber);
    // console.log(currentMonthName);
    // console.log(currentMonth);
    // console.log(currentYear);
    // return NextResponse.json({ success: true, msg: "OK" });
    for (let i = 1; i <= days; i++) {
      const newOrder = new Order({
        userId,
        managerId,
        month: currentMonthName,
        year: currentYear,
        date: new Date(currentYear, currentMonth, i).toLocaleDateString(),
        breakfast: i <= currentDateNumber ? false : true,
        lunch: i <= currentDateNumber ? false : true,
        dinner: i <= currentDateNumber ? false : true,
      });
      await newOrder.save();
    }
    const newBill = new Bill({
      userId,
      month: currentMonthName,
      year: currentYear,
    });
    await newBill.save();
    return NextResponse.json({ success: true, msg: "OK" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, msg: "Error", error });
  }
};
