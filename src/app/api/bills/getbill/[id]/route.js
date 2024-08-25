import { dbConfig } from "@/dbConfig/dbConfig";
import Bill from "@/models/billModel";
import User from "@/models/userModel";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

await dbConfig();

export const GET = async (req) => {
  try {
    const { pathname } = new URL(req.url);
    const billId = pathname.split("/").pop();
    if (!mongoose.Types.ObjectId.isValid(billId))
      return NextResponse.json({ success: false, msg: "Invalid Bill ID" });
    const bill = await Bill.findById(billId);
    const user = await User.findById(bill.userId);
    return NextResponse.json({ bill, user, success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
};
