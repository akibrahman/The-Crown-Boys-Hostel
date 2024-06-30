import Bill from "@/models/billModel";
import Market from "@/models/marketModel";
import Order from "@/models/orderModel";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

export const POST = async () => {
  try {
    await Order.deleteMany({ userId: "" });
    await Bill.deleteMany({ userId: "" });
    await User.findByIdAndUpdate("", {
      isClientVerified: false,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { msg: "Backend Error", error, success: false },
      { status: 500 }
    );
  }
};

export const PUT = async (req) => {
  try {
    const monthMarkets = await Market.findById("668005dc59a983bc762f64b8");
    const mainData = monthMarkets.data;
    for (let i = 0; i < mainData.length; i++) {
      // console.log(mainData[i]);

      // First TODO
      // mainData[i].details = [];
      // Second TODO
      // mainData[i].details = [
      //   ...mainData[i].details,
      //   { "All Market": parseInt(mainData[i].amount) },
      // ];
      // Third TODO
      mainData[i].amount = 0;
    }
    await monthMarkets.save();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
};

async function delay(s) {
  await new Promise((resolve) => setTimeout(resolve, s * 1000));
  console.log("Delayed function executed!!!!");
}

// export const runtime = "edge";
