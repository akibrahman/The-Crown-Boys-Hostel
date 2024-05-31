import Booking from "@/models/bookingModel";
import { NextResponse } from "next/server";
import { dbConfig } from "../../../dbConfig/dbConfig";

await dbConfig();

export const POST = async (req) => {
  try {
    const body = await req.json();
    const booking = new Booking(body);
    await booking.save();
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
