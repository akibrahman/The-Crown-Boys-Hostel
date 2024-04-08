import Bill from "@/models/billModel";
import Order from "@/models/orderModel";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    console.log("Process Started");
    const bills = await Bill.find({});
    for (let m = 0; m < bills.length; m++) {
      const bill = await Bill.findById(bills[m]._id);
      const userId = bill.userId;
      const month = bill.month;
      const year = bill.year;
      const orders = await Order.find({ userId, month, year });
      // console.log(orders);
      const totalBreakfast = orders.reduce(
        (accumulator, currentValue) =>
          accumulator + (currentValue.breakfast ? 1 : 0),
        0
      );
      const totalLunch = orders.reduce(
        (accumulator, currentValue) =>
          accumulator + (currentValue.lunch ? 1 : 0),
        0
      );
      const totalDinner = orders.reduce(
        (accumulator, currentValue) =>
          accumulator + (currentValue.dinner ? 1 : 0),
        0
      );
      if (month == "March") {
        bill.totalBreakfast = totalBreakfast;
        bill.totalLunch = totalLunch;
        bill.totalDinner = totalDinner;
        bill.totalBillInBDT =
          totalBreakfast * 30 + totalLunch * 60 + totalDinner * 60 + 500;
        bill.status = "calculated";
        await bill.save();
      } else {
        bill.totalBreakfast = 0;
        bill.totalLunch = 0;
        bill.totalDinner = 0;
        bill.totalBillInBDT = 0;
        bill.status = "initiated";
        await bill.save();
      }

      console.log("---------------------------------------------");
    }
    return NextResponse.json({ msg: "OK", success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { msg: "Backend Error", error, success: false },
      { status: 500 }
    );
  }
};
