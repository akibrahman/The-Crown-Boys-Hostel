import { dbConfig } from "@/dbConfig/dbConfig";
import Market from "@/models/marketModel";
import { NextResponse } from "next/server";

await dbConfig();

export const PUT = async (req) => {
  try {
    const { id1, id2, marketData } = await req.json();
    const monthMarkets = await Market.findById(id1);
    const targetedDate = monthMarkets.data.find((mrkt) => mrkt._id.equals(id2));
    targetedDate.details = marketData;
    await monthMarkets.save();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 501 });
  }
};
