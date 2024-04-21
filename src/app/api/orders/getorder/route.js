import { dbConfig } from "@/dbConfig/dbConfig";
import Order from "@/models/orderModel";
import { NextResponse } from "next/server";

dbConfig();

export const POST = async (req) => {
  try {
    // const token = cookies()?.get("token")?.value;
    // try {
    //   var decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    //   console.log("===============>", decoded);
    // } catch (error) {
    //   console.log("============>", error);
    //   if (error.message == "invalid token" || "jwt malformed") {
    //     cookies().delete("token");
    //   }
    //   return NextResponse.json({ msg: "Unauthorized", error }, { status: 400 });
    // }
    const { userId, date } = await req.json();
    console.log({ msg: "Order Changed" });
    const order = await Order.findOne({ userId, date });
    if (order) return NextResponse.json({ msg: "OK", success: true, order });
    else {
      console.log("++=>", order, userId, date);
      throw new Error("Order not found");
    }
  } catch (error) {
    console.log(error);
    console.log(error.code);
    console.log(error.message);
    return NextResponse.json({ msg: "Backend Error", error }, { status: 400 });
  }
};
