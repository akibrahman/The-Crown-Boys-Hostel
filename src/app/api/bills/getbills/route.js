import { dbConfig } from "@/dbConfig/dbConfig";
import Bill from "@/models/billModel";
import { NextResponse } from "next/server";

dbConfig();

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const month = searchParams.get("month");
    const year = searchParams.get("year");
    let query = { userId };
    if (month) query = { ...query, month };
    if (year) query = { ...query, year };
    const bills = await Bill.find(query);
    return NextResponse.json({ bills, success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
};
export const PATCH = async (req) => {
  try {
    const { billId, amount, method } = await req.json();
    if (method == "set") {
      const bill = await Bill.findById(billId);
      bill.paidBillInBDT = amount;
      await bill.save();
      return NextResponse.json({ success: true });
    } else if (method == "credite") {
      const bill = await Bill.findById(billId);
      bill.paidBillInBDT = bill.paidBillInBDT + amount;
      await bill.save();
      return NextResponse.json({ success: true });
    } else if (method == "debite") {
      const bill = await Bill.findById(billId);
      bill.paidBillInBDT = bill.paidBillInBDT - amount;
      await bill.save();
      return NextResponse.json({ success: true });
    } else {
      throw new Error();
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
};
