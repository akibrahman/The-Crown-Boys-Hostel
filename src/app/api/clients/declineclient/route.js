import User from "@/models/userModel";
import { sendSMS } from "@/utils/sendSMS";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const { id } = await req.json();
    const user = await User.findById(id);
    await sendSMS(
      user.contactNumber,
      `Hi ${user.username},\nYour registration has been declined from the Authority, Please contact with us for more Details\n\nThe Corwn Boys Hostel Authority Team`
    );
    await User.findByIdAndDelete(id);
    return NextResponse.json({
      msg: "Deleted",
      success: true,
      email: user.email,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { msg: "Backend Problem", success: false },
      { status: 500 }
    );
  }
};
