import User from "@/models/userModel";
import { sendSMS } from "@/utils/sendSMS";
import { NextResponse } from "next/server";

const { dbConfig } = require("@/dbConfig/dbConfig");

await dbConfig();

export const POST = async (req) => {
  try {
    const { _id } = await req.json();
    const user = await User.findById(_id);
    if (!user) throw new Error("User Not Found");
    if (user.profilePicture == "/__")
      throw new Error("User Is Already Reported");
    user.profilePicture = "/__";
    await user.save();
    await sendSMS(
      user.contactNumber,
      `Dear Resident,\nPlease upload your authenticated docs as E-KYC update.\nPlease don't upload anything else.\nThe Crown Boys Hostel`
    );
    return NextResponse.json({
      success: true,
      msg: "Report Successful",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, msg: error?.message },
      { status: 500 }
    );
  }
};
