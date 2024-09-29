import Bill from "@/models/billModel";
import Order from "@/models/orderModel";
import User from "@/models/userModel";
import { sendSMS } from "@/utils/sendSMS";
import { NextResponse } from "next/server";

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

    //
    const isLastDayOfCurrentMonthInBangladesh = () => {
      const today = new Date();
      today.setUTCHours(today.getUTCHours() + 6);
      const currentMonth = today.getUTCMonth();
      const currentYear = today.getUTCFullYear();
      const lastDayOfMonth = new Date(
        Date.UTC(currentYear, currentMonth + 1, 0)
      );
      return {
        isLastDay:
          today.getUTCDate() === lastDayOfMonth.getUTCDate() &&
          today.getUTCMonth() === lastDayOfMonth.getUTCMonth() &&
          today.getUTCFullYear() === lastDayOfMonth.getUTCFullYear(),
      };
    };
    const isSecondLastDayOfCurrentMonthInBangladesh = () => {
      const today = new Date();
      today.setUTCHours(today.getUTCHours() + 6);
      const currentMonth = today.getUTCMonth();
      const currentYear = today.getUTCFullYear();
      const lastDayOfMonth = new Date(
        Date.UTC(currentYear, currentMonth + 1, 0)
      );
      const secondLastDayOfMonth = new Date(lastDayOfMonth);
      secondLastDayOfMonth.setUTCDate(lastDayOfMonth.getUTCDate() - 1);
      return {
        isSecondLastDay:
          today.getUTCDate() === secondLastDayOfMonth.getUTCDate() &&
          today.getUTCMonth() === secondLastDayOfMonth.getUTCMonth() &&
          today.getUTCFullYear() === secondLastDayOfMonth.getUTCFullYear(),
      };
    };
    const aboutSecondLastDayOfCurrentMonth =
      isSecondLastDayOfCurrentMonthInBangladesh();
    const aboutLastDayOfCurrentMonth = isLastDayOfCurrentMonthInBangladesh();

    if (
      aboutSecondLastDayOfCurrentMonth.isSecondLastDay ||
      aboutLastDayOfCurrentMonth.isLastDay
    )
      throw new Error(
        "Client Acception is not Allowed on Second Last or Last Day of any Month"
      );
    //

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
    const user = await User.findByIdAndUpdate(userId, {
      isClientVerified: true,
    });
    await sendSMS(
      user.contactNumber,
      `Hi ${user.username},\nWelcome to The Crown Boys Hostel\nYou can manage everything from our website\nWebsite: https://thecrownboyshostel.com\nYou can order or change your meal anytime from here\nLink: https://thecrownboyshostel.com/order\nYou can check your current month's meal status from here\nLink: https://thecrownboyshostel.com/dashboard?displayData=currentMonth\nYou can see your all bills from here\nLink: https://thecrownboyshostel.com/dashboard?displayData=myBills\nYou can pay your bill via bKash online payment\nEvery month, you will get the bills automatically.\n\nThank you\nThe Crown Boys Hostel Automation Team`
    );
    return NextResponse.json(
      { msg: "Authorization provided as Client", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.log(error.message);
    return NextResponse.json(
      { msg: error?.message || "Backend Problem", success: false },
      { status: 500 }
    );
  }
};
