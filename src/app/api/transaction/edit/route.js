import { dbConfig } from "@/dbConfig/dbConfig";
import Bill from "@/models/billModel";
import Transaction from "@/models/transactionModel";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/userModel";

await dbConfig();

export const GET = async (req) => {
  try {
    const token = cookies()?.get("token")?.value;
    let jwtData;
    if (!token)
      return NextResponse.json({ msg: "Unauthorized", error }, { status: 400 });
    try {
      jwtData = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (error) {
      console.log(error);
      if (error.message == "invalid token" || "jwt malformed") {
        cookies().delete("token");
      }
      return NextResponse.json({ msg: "Unauthorized", error }, { status: 400 });
    }

    const manager = await User.findById(jwtData?.id);
    if (!manager || manager.role != "manager")
      return NextResponse.json({ msg: "Unauthorized", error }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const transactionId = searchParams.get("transactionId");
    if (!transactionId) throw new Error("No Transaction ID");
    if (!mongoose.Types.ObjectId.isValid(transactionId))
      throw new Error("Invalid Transaction ID");
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) throw new Error("Wrong Transaction ID");
    const bill = await Bill.findById(transaction.billId);
    const bills = await Bill.find({ userId: bill.userId });
    const user = await User.findById(bill.userId);
    console.log("Bill: ", bill);
    console.log("Payments: ", transaction.payments);
    console.log(
      "Amount: ",
      transaction.payments.reduce((a, c) => a + c.value, 0)
    );
    return NextResponse.json({
      success: true,
      user: {
        name: user.username,
        image: user.profilePicture,
        email: user.email,
        month: bill.month,
      },
      payments: transaction.payments,
      bills: bills
        .map((b) => ({
          _id: b._id.toString(),
          month: b.month,
          year: b.year,
        }))
        .filter((_b) => _b.month != bill.month),
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
};
