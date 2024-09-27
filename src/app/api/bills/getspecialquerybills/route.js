import { dbConfig } from "@/dbConfig/dbConfig";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/userModel";
import Bill from "@/models/billModel";
import Transaction from "@/models/transactionModel";
import { getCurrentDateInBangladesh } from "@/utils/getCurrentDateInBangladesh";
import Room from "@/models/roomModel";

await dbConfig();

export const GET = async (req) => {
  try {
    const token = cookies()?.get("token")?.value;
    let jwtData;
    try {
      jwtData = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (error) {
      console.log(error);
      if (error.message == "invalid token" || "jwt malformed") {
        cookies().delete("token");
      }
      return NextResponse.json({ msg: "Unauthorized", error }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const managerId = searchParams.get("managerId");
    const name = searchParams.get("name");
    if (!managerId)
      return NextResponse.json(
        { msg: "Unauthorized - No Manager ID", error },
        { status: 401 }
      );

    const manager = await User.findById(jwtData?.id);
    if (!manager || manager.role != "manager" || managerId != jwtData.id)
      return NextResponse.json({ msg: "Unauthorized", error }, { status: 401 });

    const usersUnderManager = await User.find({ manager: jwtData.id });

    const finalDataToBeSent = [];

    for (const userUnderManager of usersUnderManager) {
      const bills = await Bill.find({ userId: userUnderManager._id });
      const filteredBills = await Promise.all(
        bills.map(async (bill) => {
          const transactions = await Transaction.find({ billId: bill._id });
          const totalTransactionAmount = transactions.reduce(
            (total, transaction) => {
              const transactionSum = transaction.payments.reduce(
                (sum, payment) => sum + payment.value,
                0
              );
              return total + transactionSum;
            },
            0
          );
          if (bill.status == "calculated") {
            if (bill.totalBillInBDT > totalTransactionAmount) {
              return {
                billId: bill._id,
                totalAmount: bill.totalBillInBDT - totalTransactionAmount,
              };
            } else {
              return null;
            }
          } else if (bill.status == "initiated") {
            const currentBDDate = getCurrentDateInBangladesh();
            if (currentBDDate >= 1 && currentBDDate <= 10) {
              return null;
            } else {
              const rooms = await Room.find({
                "beds.user": bill.userId.toString(),
              });
              let totalRent = 0;
              rooms.forEach((room) => {
                room.beds.forEach((bed) => {
                  if (bed.user == bill.userId.toString()) {
                    totalRent += bed.userRent;
                  }
                });
              });
              if (totalRent == 0) totalRent = 3500;
              if (
                bill.isRentPaid
                  ? 2000 - totalTransactionAmount <= 0
                  : 2000 + totalRent - totalTransactionAmount <= 0
              ) {
                return null;
              } else {
                return {
                  billId: bill._id,
                  totalAmount: bill.isRentPaid
                    ? 2000 - totalTransactionAmount
                    : 2000 + totalRent - totalTransactionAmount,
                };
              }
            }
          }
        })
      );
      const validBills = filteredBills.filter((bill) => bill !== null);
      if (validBills.length > 0) {
        finalDataToBeSent.push({
          _id: userUnderManager._id,
          name: userUnderManager.username,
          number: userUnderManager.contactNumber,
          email: userUnderManager.email,
          photo: userUnderManager.profilePicture || "/images/no-user.png",
          amounts: validBills.map((bill) => bill.totalAmount),
          billIds: validBills.map((bill) => bill.billId),
        });
      }
    }
    let filteredData = finalDataToBeSent;
    if (name && name.trim() !== "") {
      filteredData = finalDataToBeSent.filter((item) =>
        item.name.toLowerCase().includes(name.toLowerCase())
      );
    }
    return NextResponse.json({ success: true, data: filteredData });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
};
