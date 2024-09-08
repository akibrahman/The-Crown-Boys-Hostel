import User from "@/models/userModel";
import { sendSMS } from "@/utils/sendSMS";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const { id } = await req.json();
    const user = await User.findByIdAndUpdate(id, { isClientVerified: true });
    await sendSMS(
      user.contactNumber,
      `Hi ${user.username},\nWelcome to The Crown Boys Hostel\nYou can manage everything from our website\nWebsite: https://thecrownboyshostel.com\nYou can order or change your meal anytime from here\nLink: https://thecrownboyshostel.com/order\nYou can check your current month's meal status from here\nLink: https://thecrownboyshostel.com/dashboard?displayData=currentMonth\nYou can see your all bills from here\nLink: https://thecrownboyshostel.com/dashboard?displayData=myBills\nYou can pay your bill via bKash online payment\nEvery month, you will get the bills automatically.\n\nThank you\nThe Crown Boys Hostel Automation Team`
    );
    return NextResponse.json(
      { msg: "Authorization provided as Client", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { msg: "Backend Problem", success: false },
      { status: 500 }
    );
  }
};
