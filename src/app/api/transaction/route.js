import { dbConfig } from "@/dbConfig/dbConfig";
import Bill from "@/models/billModel";
import Transaction from "@/models/transactionModel";
import User from "@/models/userModel";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";

await dbConfig();

export const GET = async (req) => {
  try {
    //
    const token = cookies()?.get("token")?.value;
    try {
      jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (error) {
      console.log(error);
      if (error.message == "invalid token" || "jwt malformed") {
        cookies().delete("token");
      }
      return NextResponse.json({ msg: "Unauthorized", error }, { status: 400 });
    }
    //
    const { searchParams } = new URL(req.url);
    const billId = searchParams.get("id");
    let query = {};
    if (billId) query = { ...query, billId };
    const transactions = await Transaction.find(query);
    return NextResponse.json({
      success: true,
      transactions,
      msg: "Transactions fetched successfully",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
};

export const POST = async (req) => {
  try {
    //
    const token = cookies()?.get("token")?.value;
    try {
      const jwtData = jwt.verify(token, process.env.TOKEN_SECRET);
      const user = await User.findById(jwtData.id);
      if (!user.isManager || !user.isManagerVerified)
        throw new Error("Unauthorized");
    } catch (error) {
      console.log(error);
      if (error.message == "invalid token" || "jwt malformed") {
        cookies().delete("token");
      }
      return NextResponse.json({ msg: "Unauthorized", error }, { status: 400 });
    }
    //
    const {
      billId,
      payments,
      coupon,
      note,
      reason,
      reference,
      transactionId,
      transactionDate,
      method,
    } = await req.json();
    let user;
    if (billId !== "new") {
      if (!mongoose.Types.ObjectId.isValid(billId))
        return NextResponse.json({ success: false, msg: "Invalid Bill ID" });
      if (payments.length <= 0)
        return NextResponse.json({ success: false, msg: "No Payments Added" });
      const bill = await Bill.findById(billId);
      if (!bill)
        return NextResponse.json({ success: false, msg: "Wrong Bill ID" });
      user = await User.findById(bill.userId);
      if (!user)
        return NextResponse.json({ success: false, msg: "Wrong Bill ID" });
    }
    await new Transaction({
      userId: billId === "new" ? "" : user?._id,
      billId: billId === "new" ? "" : billId,
      note: note || "",
      reason: reason || "",
      coupon: coupon || "",
      reference: reference || "",
      transactionId,
      transactionDate,
      method: method || "cash",
      tax: 0,
      payments,
    }).save();
    return NextResponse.json({
      success: true,
      msg: "Transaction saved successfully",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
};

export const PUT = async (req, res) => {
  try {
    const transactionIdGen = () => {
      const randomChars = crypto.randomBytes(4).toString("hex");
      return randomChars.toUpperCase().toString();
    };
    let unique = false;
    let transactionId = "";
    while (!unique) {
      transactionId = transactionIdGen();
      const existingTransaction = await Transaction.findOne({
        transactionId,
      });
      if (!existingTransaction) {
        unique = true;
      }
    }
    return NextResponse.json({
      success: true,
      transactionId,
    });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to update bills",
      details: error.message,
    });
  }
};
