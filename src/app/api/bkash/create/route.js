import { NextResponse } from "next/server";
import axios from "axios";
import { dbConfig } from "@/dbConfig/dbConfig";
import Bill from "@/models/billModel";
import User from "@/models/userModel";
import Transaction from "@/models/transactionModel";
import Room from "@/models/roomModel";
import queryString from "query-string";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import crypto from "crypto";

await dbConfig();
// https://client.sandbox.bka.sh/assets/bkash_payment_logo-37beb24a.svg

export const POST = async (req) => {
  try {
    const token = cookies()?.get("token")?.value;
    try {
      verify(token, process.env.TOKEN_SECRET);
    } catch (error) {
      console.log(error);
      if (error.message == "invalid token" || "jwt malformed") {
        cookies().delete("token");
      }
      return NextResponse.json({ msg: "Unauthorized", error }, { status: 400 });
    }
    const { billId, invoiceData } = await req.json();
    if (!invoiceData || invoiceData.length == 0) {
      console.log("No Invoice Data");
      throw new Error("No Invoice Data");
    }
    const amount = Math.ceil(invoiceData.reduce((a, c) => a + c.value, 0));
    const finalInvoiceDataa = {};
    invoiceData.forEach((idd) => {
      finalInvoiceDataa[idd.name + "_crowninvoice"] = idd.value;
    });
    const queryToBePassed = queryString.stringify(finalInvoiceDataa);
    const { data } = await axios.post(
      process.env.BKASH_GRANT_TOKEN_URL,
      {
        app_key: process.env.BKASH_APP_KEY,
        app_secret: process.env.BKASH_SECRET_KEY,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          username: process.env.BKASH_USERNAME,
          password: process.env.BKASH_PASSWORD,
        },
      }
    );
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
    const { id_token } = data;
    const requestBody = {
      mode: "0011",
      payerReference: "bkash-pay-from-user",
      callbackURL: `${process.env.CLIENT_SIDE}/api/bkash/execute?amount=${amount}&billId=${billId}&${queryToBePassed}`,
      amount: amount.toString(),
      currency: "BDT",
      intent: "sale",
      merchantInvoiceNumber: transactionId,
    };
    const { data: createData } = await axios.post(
      process.env.BKASH_CREATE_PAYMENT_URL,
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: id_token,
          "X-App-Key": process.env.BKASH_APP_KEY,
        },
      }
    );
    return NextResponse.json({ ...createData, success: true });
  } catch (error) {
    console.log(error.message);
    return NextResponse.json(
      { success: false, msg: "Server error, Try again!", error },
      { status: 500 }
    );
  }
};

export const PUT = async (req) => {
  try {
    const { id } = await req.json();
    const bill = await Bill.findById(id);
    const user = await User.findById(bill.userId);
    const transactions = await Transaction.find({
      userId: user._id.toString(),
      billId: id,
    });
    const transactionAmount = transactions?.reduce((total, transaction) => {
      const transactionSum = transaction.payments.reduce(
        (sum, payment) => sum + payment.value,
        0
      );
      return total + transactionSum;
    }, 0);
    if (transactionAmount == bill.totalBillInBDT && bill.status == "calculated")
      return NextResponse.json({
        msg: "No need to pay any amount in this Bill, This Bill is Paid already",
        success: false,
      });

    const rooms = await Room.find({
      "beds.user": user._id.toString(),
    });
    let totalRent = 0;
    rooms.forEach((room) => {
      room.beds.forEach((bed) => {
        if (bed.user == user._id.toString()) {
          totalRent += bed.userRent;
        }
      });
    });
    if (totalRent == 0) totalRent = 3500;

    return NextResponse.json({ rent: totalRent, success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, msg: "Server error, Try again!", error },
      { status: 500 }
    );
  }
};
