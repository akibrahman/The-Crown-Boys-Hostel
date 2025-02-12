import Booking from "@/models/bookingModel";
import { NextResponse } from "next/server";
import { dbConfig } from "../../../dbConfig/dbConfig";
import Room from "@/models/roomModel";
import axios from "axios";
import crypto from "crypto";
import Transaction from "@/models/transactionModel";
import queryString from "query-string";
import { sendSMS } from "@/utils/sendSMS";

await dbConfig();

export const PATCH = async () => {
  try {
    const bookings = await Booking.find({});
    console.log(bookings);
    return NextResponse.json({
      success: true,
      msg: "Got All Bookings",
      bookings,
    });
  } catch (error) {
    console.log(error.message);
    return NextResponse.json(
      { success: false, msg: "Server error, Try again!", error },
      { status: 501 }
    );
  }
};

export const POST = async (req) => {
  try {
    const body = await req.json();
    const roomIds = body?.beds?.map((item) => item.roomId);
    const rooms = await Room.find({ _id: { $in: roomIds } });
    let totalBookingCharge = 0;
    body?.beds?.forEach((bedRoom) => {
      const room = rooms.find((room) => room._id.toString() === bedRoom.roomId);
      if (room) {
        const bed = room.beds.find((bed) => bed.bedNo === bedRoom.bedNo);
        if (bed) {
          totalBookingCharge += bed.bookingCharge;
        }
      }
    });
    // Bkash Start
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
    //
    const queryParams = new URLSearchParams();
    body?.beds?.forEach((item) => {
      queryParams.append("bedNo", item.bedNo);
      queryParams.append("roomId", item.roomId);
    });
    //
    const requestBody = {
      mode: "0011",
      payerReference: "bkash-pay-from-user",
      callbackURL: `${
        process.env.CLIENT_SIDE
      }/api/booking?amount=${totalBookingCharge}&name=${encodeURIComponent(
        body.name
      )}&phoneNumber=${encodeURIComponent(
        body.phoneNumber
      )}&email=${encodeURIComponent(
        body.email
      )}&bookingTime=${encodeURIComponent(
        body.bookingTime
      )}&id_token=${id_token}&${queryParams.toString()}`,
      amount: totalBookingCharge.toString(),
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
    console.log("==========>", queryParams.toString());
    return NextResponse.json({ ...createData, success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, msg: "Server error, Try again!", error },
      { status: 500 }
    );
  }
};

export const GET = async (req) => {
  try {
    let queries = [];
    const { searchParams } = new URL(req?.url);
    searchParams?.forEach((value, key) => {
      queries?.push({ [key]: value });
    });
    const status = queries?.find((obj) => obj?.status)?.status;
    const paymentID = queries?.find((obj) => obj?.paymentID)?.paymentID;
    const id_token = queries?.find((obj) => obj?.id_token)?.id_token;
    const amount = queries?.find((obj) => obj?.amount)?.amount;
    const name = queries?.find((obj) => obj?.name)?.name;
    const phoneNumber = queries?.find((obj) => obj?.phoneNumber)?.phoneNumber;
    const email = queries?.find((obj) => obj?.email)?.email;
    const bookingTime = queries?.find((obj) => obj?.bookingTime)?.bookingTime;
    let bedRoomArray = [];
    const bedNos = searchParams?.getAll("bedNo");
    const roomIds = searchParams?.getAll("roomId");
    bedNos?.forEach((bedNo, index) => {
      bedRoomArray.push({
        bedNo,
        roomId: roomIds[index],
      });
    });
    const redirectUrl = `${process.env.CLIENT_SIDE}/rooms/${bedRoomArray[0].roomId}`;
    if (status == "cancel") {
      return NextResponse.redirect(
        redirectUrl +
          `?success=false&status=${status}&paymentID=${paymentID}&message=${encodeURIComponent(
            "Payment Cancelled"
          )}`
      );
    }
    if (status === "failure") {
      return NextResponse.redirect(
        redirectUrl +
          `?success=false&status=${status}&paymentID=${paymentID}&message=${encodeURIComponent(
            "Payment Failed"
          )}`
      );
    }
    const { data: executeData } = await axios.post(
      process.env.BKASH_EXECUTE_PAYMENT_URL,
      { paymentID },
      {
        headers: {
          Accept: "application/json",
          Authorization: id_token,
          "X-App-Key": process.env.BKASH_APP_KEY,
        },
      }
    );
    if (
      executeData?.transactionStatus != "Completed" ||
      executeData?.statusCode != "0000" ||
      executeData?.statusMessage != "Successful"
    ) {
      return NextResponse.redirect(
        redirectUrl +
          `&success=false&status=${executeData?.transactionStatus}&paymentID=${
            executeData.paymentID
          }&message=${encodeURIComponent(executeData?.statusMessage)}`
      );
    }
    await new Booking({
      name,
      phoneNumber,
      email,
      beds: bedRoomArray,
      bookingTime,
    }).save();
    const message = `Hi ${name},\nWe have received your booking\nWe are contacting with you ASAP\n\nThe Crown Boys Hotel`;
    const message2 = `${name} made a booking to our hostel, check it ASAP\n\nThe Crown Boys Hotel`;
    await sendSMS(phoneNumber, message);
    await sendSMS("01709605097", message2);
    for (const { bedNo, roomId } of bedRoomArray) {
      await Room.updateOne(
        { _id: roomId, "beds.bedNo": bedNo },
        { $set: { "beds.$.isBooked": true } }
      );
    }
    await new Transaction({
      userId: name,
      billId: phoneNumber,
      note: "Booking Confirmation Payment",
      reason: "booking",
      transactionId: executeData.merchantInvoiceNumber,
      bKashTransactionId: executeData.trxID,
      transactionDate: new Date().toLocaleString(),
      method: "bkash",
      payments: [{ name: "Booking Charge", value: parseInt(amount) }],
    }).save();

    return NextResponse.redirect(
      redirectUrl +
        `?success=true&status=success&msg=${encodeURIComponent(
          "Booking Confirmed and Payment Successful"
        )}&transactionId=${executeData.merchantInvoiceNumber}&trxId=${
          executeData.trxID
        }&amount=${amount}&paymentID=${executeData.paymentID}`
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, msg: "Server error, Try again!", error },
      { status: 500 }
    );
  }
};
