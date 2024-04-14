import ManagerBill from "@/models/managerBillModel";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const marketId = searchParams.get("marketId");
    const managerBill = await ManagerBill.findOne({ marketId });
    return NextResponse.json({ msg: "OK", success: true, managerBill });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: "Backend Error", error }, { status: 500 });
  }
};
