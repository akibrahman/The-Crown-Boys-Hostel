import { dbConfig } from "@/dbConfig/dbConfig";
import Bill from "@/models/billModel";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

await dbConfig();

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const month = searchParams.get("month");
    const year = searchParams.get("year");
    const user = await User.findById(userId);
    const userName = user.username;
    let query = { userId };
    if (month) query = { ...query, month };
    if (year) query = { ...query, year };
    const billsWithoutName = await Bill.find(query);
    const bills = billsWithoutName.map((bill) => ({
      ...bill.toObject(),
      userName,
    }));
    console.log(bills);
    return NextResponse.json({ bills, success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
};
export const PATCH = async (req) => {
  try {
    const { billId, method, rentStatus } = await req.json();
    if (method == "rent") {
      await Bill.findByIdAndUpdate(billId, { isRentPaid: rentStatus });
      return NextResponse.json({ success: true });
    } else {
      throw new Error();
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
};
