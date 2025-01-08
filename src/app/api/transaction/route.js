import { dbConfig } from "@/dbConfig/dbConfig";
import Bill from "@/models/billModel";
import Transaction from "@/models/transactionModel";
import User from "@/models/userModel";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { sendSMS } from "@/utils/sendSMS";
import axios from "axios";

await dbConfig();

export const GET = async (req) => {
  try {
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
    if (!billId)
      return NextResponse.json({ success: false, msg: "Missing Bill ID" });
    if (mongoose.Types.ObjectId.isValid(billId)) {
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
      userId: !mongoose.Types.ObjectId.isValid(billId)
        ? billId.split("__")[0]
        : user?._id,
      billId: !mongoose.Types.ObjectId.isValid(billId)
        ? billId.split("__")[1]
        : billId,
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

    const totalPayment = payments.reduce(
      (sum, payment) => sum + payment.value,
      0
    );
    try {
      const receiptLink = await axios.get(
        `https://ulvis.net/api.php?url=https://thecrownboyshostel.com/qr/${transactionId}&private=1`
      );
      const sms = `Dear ${user.username},\nWe have received your payment of ${totalPayment} BDT.\nReceipt: ${receiptLink.data}\nThank you for choosing The Crown Boys Hostel.`;
      await sendSMS(
        !mongoose.Types.ObjectId.isValid(billId)
          ? billId.split("__")[1]
          : user?.contactNumber,
        sms
      );
    } catch (error) {
      console.log(error);
      return NextResponse.json({
        success: true,
        msg: `Transaction saved successfully But SMS Sent Error - Error is: ${error.message}`,
      });
    }

    return NextResponse.json({
      success: true,
      msg: "Transaction saved successfully",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, msg: error.message, error },
      { status: 500 }
    );
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

export const PATCH = async (req) => {
  try {
    //
    const token = cookies()?.get("token")?.value;
    let jwtData;
    try {
      jwtData = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (error) {
      console.log(error);
      if (error.message == "invalid token" || "jwt malformed") {
        cookies().delete("token");
      }
      return NextResponse.json({ msg: "Unauthorized", error }, { status: 400 });
    }
    //
    const { billId, extraMoney } = await req.json();
    if (!billId || !extraMoney)
      return NextResponse.json({
        success: false,
        msg: "Missing Bill ID or extraMoney",
      });
    const bill = await Bill.findById(billId);
    if (!bill)
      return NextResponse.json({
        success: false,
        msg: "Wrong Bill ID",
      });
    if (jwtData.id != bill.userId)
      return NextResponse.json({
        success: false,
        msg: "Unauthorized - Unknown User",
      });
    // let currentDate = new Date().toLocaleString("en-US", {
    //   timeZone: "Asia/Dhaka",
    // });
    // let currentMonthNumber = new Date(currentDate).getMonth();
    // let currentYear = new Date(currentDate).getFullYear();
    // let nextMonth;
    // let nextYear;
    // if (currentMonthNumber < 11) {
    //   nextMonth = new Date(
    //     currentYear,
    //     currentMonthNumber + 1,
    //     1
    //   ).toLocaleDateString("en-BD", {
    //     month: "long",
    //     timeZone: "Asia/Dhaka",
    //   });
    //   nextYear = currentYear;
    // } else {
    //   nextMonth = new Date(currentYear + 1, 0, 1).toLocaleDateString("en-BD", {
    //     month: "long",
    //     timeZone: "Asia/Dhaka",
    //   });
    //   nextYear = currentYear + 1;
    // }
    const nextYear =
      new Date(`${bill.month} 1, 2000`).getMonth() < 11
        ? bill.year
        : bill.year + 1;

    const nextMonth =
      new Date(`${bill.month} 1, 2000`).getMonth() < 11
        ? new Date(
            bill.year,
            new Date(`${bill.month} 1, 2000`).getMonth() + 1,
            1
          ).toLocaleDateString("en-BD", {
            month: "long",
            timeZone: "Asia/Dhaka",
          })
        : "January";
    const nextBill = await Bill.findOne({
      userId: bill.userId,
      year: nextYear,
      month: nextMonth,
    });
    if (!nextBill)
      return NextResponse.json({
        success: false,
        msg: "No Transferable Bill Created, Please Contact with Manager",
      });
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
    await new Transaction({
      userId: bill.userId,
      billId,
      note: "Transfer to Next Month",
      reason: "transfer",
      transactionId,
      transactionDate: new Date().toLocaleString("en-US", {
        timeZone: "Asia/Dhaka",
      }),
      method: "cash",
      tax: 0,
      payments: [{ name: `To - ${nextMonth}`, value: extraMoney * -1 }],
    }).save();
    unique = false;
    transactionId = "";
    while (!unique) {
      transactionId = transactionIdGen();
      const existingTransaction = await Transaction.findOne({
        transactionId,
      });
      if (!existingTransaction) {
        unique = true;
      }
    }
    await new Transaction({
      userId: bill.userId,
      billId: nextBill._id,
      note: "Received from Previous Month",
      reason: "transfer",
      transactionId,
      transactionDate: new Date().toLocaleString("en-US", {
        timeZone: "Asia/Dhaka",
      }),
      method: "cash",
      tax: 0,
      payments: [{ name: `From - ${bill.month}`, value: extraMoney }],
    }).save();
    return NextResponse.json({
      success: true,
      msg: "Deposit Transferred Successfully",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
};
