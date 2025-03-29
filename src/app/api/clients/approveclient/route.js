import { dbConfig } from "@/dbConfig/dbConfig";
import Bill from "@/models/billModel";
import Order from "@/models/orderModel";
import User from "@/models/userModel";
import { sendSMS } from "@/utils/sendSMS";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

await dbConfig();

export const POST = async (req) => {
  try {
    const {
      userId,
      days,
      currentDateNumber,
      currentMonthName,
      currentMonth,
      currentYear,
    } = await req.json();
    if (
      userId == null ||
      days == null ||
      currentDateNumber == null ||
      currentMonthName == null ||
      currentMonth == null ||
      currentYear == null
    )
      throw new Error("Data Missing");

    const client = await User.findById(userId);
    if (!client) throw new Error("Invalid ID!");

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
    if (!manager || manager.role != "manager" || client.manager !== jwtData?.id)
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
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

    for (let i = 1; i <= days; i++) {
      const isOrder = await Order.findOne({
        userId,
        month: currentMonthName,
        year: currentYear,
        date: new Date(currentYear, currentMonth, i).toLocaleDateString(),
      });
      if (isOrder) {
        console.log("Order Exists!");
      } else {
        await new Order({
          userId,
          managerId: jwtData?.id,
          month: currentMonthName,
          year: currentYear,
          date: new Date(currentYear, currentMonth, i).toLocaleDateString(),
          breakfast: false,
          lunch: i <= currentDateNumber ? false : true,
          dinner: i <= currentDateNumber ? false : true,
        }).save();
      }
    }
    const isBill = await Bill.findOne({
      userId,
      month: currentMonthName,
      year: currentYear,
    });
    if (isBill) {
      console.log("Bill Exists!");
    } else {
      await new Bill({
        userId,
        month: currentMonthName,
        year: currentYear,
      }).save();
    }

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
