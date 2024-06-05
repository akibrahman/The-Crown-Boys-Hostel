import { sendEmail } from "@/helpers/mailer";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  const { email, emailType, userId, userName } = await req.json();
  const user = await User.findOne({ email });
  if (!user)
    return NextResponse.json({ msg: "User not found!", success: false });
  await sendEmail({
    email,
    emailType,
    userId,
    userName: userName || user.username,
  });
  return NextResponse.json({ msg: "E-mail sent", success: true });
};
