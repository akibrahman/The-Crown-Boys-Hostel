import { dbConfig } from "@/dbConfig/dbConfig";
import Bill from "@/models/billModel";
import Order from "@/models/orderModel";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/userModel";

await dbConfig();

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");
    const year = searchParams.get("year");
    const userId = searchParams.get("userId");
    const managerId = searchParams.get("managerId");
    if (!month || !year) throw new Error("Missing Data");

    let query = {};
    if (month) query = { ...query, month };
    if (year) query = { ...query, year };
    if (userId) query = { ...query, userId };
    if (managerId) query = { ...query, managerId };

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
    if (!manager || manager.role != "manager")
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });

    const orders = await Order.find(query);
    let bill = {};
    if (userId && month) bill = await Bill.findOne({ userId, month });

    if (orders.length == 0 && !bill) throw new Error("Data Not Found");

    return NextResponse.json({ success: true, orders, bill });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
};

export const PUT = async (req) => {
  try {
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
    if (!manager || manager.role != "manager")
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    //
    const { data, userId, fromDate, toDate, fromDay, toDay } = await req.json();
    if (Object.keys(data).length == 0) {
      return NextResponse.json({ success: false, code: 111 });
    }
    const user = await User.findById(jwtData.id);
    if (!User) throw new Error("User not found");
    if (user?.blockDate) {
      if (
        moment(user.blockDate).isBetween(moment(fromDate), moment(toDate)) ||
        moment(user.blockDate).isBefore(moment(fromDate)) ||
        moment(user.blockDate).isBefore(moment(toDate))
      ) {
        throw new Error(
          `You are Blocked from ${new Date(user.blockDate).toDateString()}`
        );
      }
    }
    for (let i = fromDay; i <= toDay; i++) {
      const order = await Order.findOne({
        userId,
        date: fromDate.split("/")[0] + "/" + i + "/" + fromDate.split("/")[2],
      });
      if (!order) continue;
      if (Object.keys(data).includes("breakfast"))
        order.breakfast = data.breakfast;
      if (Object.keys(data).includes("lunch")) order.lunch = data.lunch;
      if (Object.keys(data).includes("dinner")) order.dinner = data.dinner;
      await order.save();
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("===========>", error);
    return NextResponse.json(
      { success: false, msg: error?.message || "Backend Error", error },
      { status: 500 }
    );
  }
};
