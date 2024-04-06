import Market from "@/models/marketModel";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const { id, days, currentMonth, currentMonthName, currentYear } =
      await req.json();
    await User.findOneAndUpdate(
      { _id: id },
      { $set: { isManagerVerified: true } }
    );
    let dataOfMarket = [];
    for (let l = 1; l <= days; l++) {
      dataOfMarket.push({
        date: new Date(currentYear, currentMonth, l).toLocaleDateString(
          "en-BD",
          {
            timeZone: "Asia/Dhaka",
          }
        ),
        amount: 0,
      });
    }
    const newMarket = new Market({
      managerId: id,
      month: currentMonthName,
      year: currentYear,
      data: dataOfMarket,
    });
    await newMarket.save();
    dataOfMarket = [];
    return NextResponse.json(
      { msg: "Authorization provided as Manager", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { msg: "Backend Problem", success: false },
      { status: 500 }
    );
  }
};
