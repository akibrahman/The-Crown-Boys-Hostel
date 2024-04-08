import Market from "@/models/marketModel";
import { NextResponse } from "next/server";

export const PUT = async (req) => {
  try {
    const { id1, id2, amount } = await req.json();
    console.log(id1, "--", id2);
    const monthMarkets = await Market.findById(id1);
    const targetedDate = monthMarkets.data.find((mrkt) => mrkt._id.equals(id2));
    targetedDate.amount = amount;
    await monthMarkets.save();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
};
