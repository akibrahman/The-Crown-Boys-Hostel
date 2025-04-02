import { dbConfig } from "@/dbConfig/dbConfig";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/userModel";
import Booking from "@/models/bookingModel";
import Transaction from "@/models/transactionModel";
import mongoose from "mongoose";

await dbConfig();

// Creating PreBooking
export const POST = async (req) => {
  try {
    const {
      source,
      roomId,
      bedNo,
      roomName,
      roomFloor,
      roomBuilding,
      name,
      number,
      email,
      isPaid,
      transactionId,
      checkinMonth,
      advanceAmount,
      beds = [],
    } = await req.json();

    if (!source || (source != "office" && source != "web"))
      throw new Error("Invalid Source!");

    const token = cookies()?.get("token")?.value;
    if (!token)
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
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

    if (source == "office") {
      const manager = await User.findById(jwtData?.id);
      if (!manager || manager.role != "manager")
        return NextResponse.json(
          { msg: "Unauthorized", error },
          { status: 401 }
        );

      let transaction;
      if (isPaid)
        transaction = await new Transaction({
          userId: name,
          billId: number,
          note: `Advance Rent - ${checkinMonth}`,
          reason: "Payment",
          coupon: "",
          reference: "",
          transactionId: transactionId.value,
          transactionDate: new Date().toLocaleString("en-US", {
            timeZone: "Asia/Dhaka",
          }),
          method: "cash",
          tax: 0,
          payments: [
            {
              name: `Advance Rent - ${checkinMonth}`,
              value: advanceAmount,
            },
          ],
        }).save();

      await new Booking({
        name,
        email,
        phoneNumber: number,
        isPaid,
        bookingTime: new Date().toISOString("en-US", {
          timeZone: "Asia/Dhaka",
        }),
        source,
        checkIn: checkinMonth,
        transactionId: transaction?._id,
        beds: [
          {
            roomId,
            bedNo,
            roomName,
            roomFloor,
            roomBuilding,
          },
        ],
      }).save();
    } else if (source == "web") {
    }

    return NextResponse.json({ msg: "Booking Created", success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        msg: error?.message || "Server error, Try again!",
        error,
      },
      { status: 500 }
    );
  }
};

// Editing PreBooking
export const PUT = async (req) => {
  try {
    const { id } = await req.json();

    if (!id) throw new Error("Invalid Data!");

    const token = cookies()?.get("token")?.value;
    if (!token)
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
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

    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid ID");
    const preBooking = await Booking.findById(id);
    if (!preBooking) throw new Error("Wrong ID");

    await Booking.findByIdAndUpdate(id, {
      isResponded: !preBooking.isResponded,
    });

    return NextResponse.json({
      msg: "Booking Marked Responded",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        msg: error?.message || "Server error, Try again!",
        error,
      },
      { status: 500 }
    );
  }
};

// Getting Single Transaction Data
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
    return NextResponse.json({
      success: true,
      transaction,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, msg: error.message },
      { status: 500 }
    );
  }
};

export const DELETE = async (req) => {
  try {
    const token = cookies()?.get("token")?.value;
    let jwtData;
    if (!token)
      return NextResponse.json({ msg: "Unauthorized", error }, { status: 400 });
    try {
      jwtData = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (error) {
      if (error.message == "invalid token" || "jwt malformed") {
        cookies().delete("token");
      }
      return NextResponse.json({ msg: "Unauthorized", error }, { status: 400 });
    }

    const manager = await User.findById(jwtData?.id);
    if (!manager || manager.role != "manager")
      return NextResponse.json({ msg: "Unauthorized", error }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const _id = searchParams.get("_id");
    if (!_id) throw new Error("No ID");
    if (!mongoose.Types.ObjectId.isValid(_id)) throw new Error("Invalid ID");
    const booking = await Booking.findById(_id);
    if (!booking) throw new Error("Wrong ID");
    await Booking.findByIdAndDelete(_id);
    return NextResponse.json({
      success: true,
      msg: "Deleted Successfully!",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, msg: error.message },
      { status: 500 }
    );
  }
};
