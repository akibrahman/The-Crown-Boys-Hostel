import { sendEmail } from "@/helpers/mailer";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  const { email, emailType, userId } = await req.json();
  await sendEmail({ email, emailType, userId });
  return NextResponse.json({ msg: "E-mail sent", success: true });
};
