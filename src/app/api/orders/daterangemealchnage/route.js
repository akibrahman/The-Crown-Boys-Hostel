import Order from "@/models/orderModel";
import { NextResponse } from "next/server";

export const PUT = async (req) => {
  try {
    const { data, userId, fromDate, toDate, fromDay, toDay } = await req.json();
    if (Object.keys(data).length == 0) {
      return NextResponse.json({ success: false, code: 111 });
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
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
};
