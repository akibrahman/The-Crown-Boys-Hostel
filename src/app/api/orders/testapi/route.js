import MonthlyBillEmail from "@/Components/MonthlyBillEmail/MonthlyBillEmail";
import { render } from "@react-email/render";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const POST = async (req) => {
  try {
    const transport = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS,
      },
    });
    const emailHtml = render(
      MonthlyBillEmail({
        name: "MD. Akib Rahman",
        email: "akibrahman5200@gmail.com",
        month: "December",
        date: "31/12/2024",
        billId: "bill_5453135468548",
        userId: "user_4535413513535",
        totalBreakfast: "31",
        totalLunch: "31",
        totalDinner: "31",
        totalDeposit: "3000",
        totalBill: "5150",
      })
    );
    const mailOptions = {
      from: "checker@hostelplates.com",
      to: "akibrahman5200@gmail.com",
      subject: "Manager Expo - Test Monthly Bill",
      html: emailHtml,
    };

    const mailRes = await transport.sendMail(mailOptions);
    return NextResponse.json({ msg: "OK", success: true, mailRes });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { msg: "Backend Error", error, success: false },
      { status: 500 }
    );
  }
};
