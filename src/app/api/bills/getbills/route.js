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
