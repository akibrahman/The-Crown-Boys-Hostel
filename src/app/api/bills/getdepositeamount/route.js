import { dbConfig } from "@/dbConfig/dbConfig";
import Bill from "@/models/billModel";
import Transaction from "@/models/transactionModel";
import { NextResponse } from "next/server";

await dbConfig();

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const month = searchParams.get("month");
    const year = searchParams.get("year");
    if (!userId || !month || !year) throw new Error("Missing Data");
    let query = { userId, month, year };
    const bill = await Bill.findOne(query);
    if (!bill) throw new Error("Bill not Found!");
    const transactions = await Transaction.find({ billId: bill._id });
    const totalDeposite = transactions.reduce(
      (a, c) => a + c.payments.reduce((a2, c2) => a2 + parseInt(c2.value), 0),
      0
    );
    return NextResponse.json({ totalDeposite, success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
};
