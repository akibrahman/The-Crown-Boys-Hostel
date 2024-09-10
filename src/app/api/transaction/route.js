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
    const transactions = await Transaction.find({ billId });
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
      transactionDate: new Date().toLocaleString("en-US", {
        timeZone: "Asia/Dhaka",
      }),
      method: method || "cash",
      tax: parseFloat(payments.reduce((a, c) => a + c.value, 0) * 0.01).toFixed(
        2
      ),
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

// This API will update All Bills by new model
export const PUT = async (req, res) => {
  try {
    const result = await Bill.updateMany({ $unset: { paidBillInBDT: "" } });

    if (result.modifiedCount > 0) {
      return NextResponse.json({
        success: true,
        message:
          "All bills with 'paidBillInBDT' field updated successfully, field removed.",
        modifiedCount: result.modifiedCount,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "'paidBillInBDT' field did not exist in any documents.",
      });
    }
  } catch (error) {
    return NextResponse.json({
      error: "Failed to update bills",
      details: error.message,
    });
  }
};

// This API will create a Transaction for All Bills
export const PATCH = async (req, res) => {
  try {
    const bills = await Bill.find({ paidBillInBDT: { $gt: 0 } });
    for (const bill of bills) {
      const { _id, userId, paidBillInBDT } = bill;
      console.log(paidBillInBDT);
      const newTransaction = new Transaction({
        userId: userId,
        billId: _id,
        note: "Transactions for Older Bills",
        reason: "Bill Payment Old",
        methode: "cash",
        payments: [{ name: "all", value: parseInt(paidBillInBDT) }],
        transactionDate: new Date().toLocaleString("en-US", {
          timeZone: "Asia/Dhaka",
        }),
        transactionId: crypto.randomBytes(4).toString("hex").toUpperCase(),
      });
      await newTransaction.save();
    }

    return NextResponse.json({
      message: "Transactions created successfully for all bills.",
    });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to create transactions",
      details: error.message,
    });
  }
};
