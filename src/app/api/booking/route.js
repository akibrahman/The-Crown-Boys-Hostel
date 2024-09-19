import Booking from "@/models/bookingModel";
import { NextResponse } from "next/server";
import { dbConfig } from "../../../dbConfig/dbConfig";

await dbConfig();

export const GET = async () => {
  try {
    const bookings = await Booking.find({});
    return NextResponse.json({
      success: true,
      msg: "Got All Bookings",
      bookings,
    });
  } catch (error) {
    console.log("=====================", error.message);
    return NextResponse.json(
      { success: false, msg: "Server error, Try again!", error },
      { status: 501 }
    );
  }
};

export const POST = async (req) => {
  try {
    const body = await req.json();
    const booking = new Booking(body);
    await booking.save();
    //! SMS
    const url = "http://bulksmsbd.net/api/smsapi";
    const apiKey = process.env.SMS_API_KEY;
    const senderId = "8809617618230";
    const message = `Hi ${body.name},\nWe have received your booking\nWe are contacting with you ASAP\n\nThe Crown Boys Hotel`;
    const message2 = `${body.name} made a booking to our hostel, check it ASAP\n\nThe Crown Boys Hotel`;
    const smsClientData = {
      api_key: apiKey,
      senderid: senderId,
      number: body.phoneNumber,
      message: message,
    };
    const smsOwnerData = {
      api_key: apiKey,
      senderid: senderId,
      number: "01709605097,01788422002",
      message: message2,
    };
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(smsClientData),
    });
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(smsOwnerData),
    });
    //! SMS
    return NextResponse.json({
      success: true,
      msg: "Booking created successfully",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, msg: "Server error, Try again!", error },
      { status: 500 }
    );
  }
};
