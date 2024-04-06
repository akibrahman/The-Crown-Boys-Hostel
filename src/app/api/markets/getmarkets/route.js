import Market from "@/models/marketModel";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const { managerId, month, year } = await req.json();
    const market = await Market.findOne({ managerId, month, year });
    return NextResponse.json({ msg: "OK", success: true, market });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: "Backend Error", error }, { status: 500 });
  }
};
