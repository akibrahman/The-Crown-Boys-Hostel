import Bill from "@/models/billModel";
import Order from "@/models/orderModel";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const POST = async () => {
  try {
    await Order.deleteMany({
      userId: "663916d667e9d16d56add11d",
      month: "July",
      year: 2024,
    });
    await Bill.deleteMany({
      userId: "663916d667e9d16d56add11d",
      month: "July",
      year: 2024,
    });
    // await User.findByIdAndUpdate("", {
    //   isClientVerified: false,
    // });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { msg: "Backend Error", error, success: false },
      { status: 500 }
    );
  }
};
// Blank All PP, NID & BC
export const PUT = async (req) => {
  try {
    // await User.updateMany({
    //   profilePicture: "/__",
    //   birthCertificatePicture: "/__",
    //   nidFrontPicture: "/__",
    //   nidBackPicture: "/__",
    //   idPicture: "/__",
    // });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
};

async function delay(s) {
  await new Promise((resolve) => setTimeout(resolve, s * 1000));
  console.log("Delayed function executed!!!!");
}

export const PATCH = async () => {
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
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: "akibrahman5200@gmail.com",
      subject: "Cron Job Test E-mail",
      html: `<p>Cron Job: This mail is before Delay</p>`,
    };
    const mailOptions2 = {
      from: process.env.GMAIL_USER,
      to: "akibrahman5200@gmail.com",
      subject: "Cron Job Test E-mail",
      html: `<p>Cron Job: This mail is after Delay</p>`,
    };
    await transport.sendMail(mailOptions);
    await delay(300);
    await transport.sendMail(mailOptions2);
    return NextResponse.json(
      { success: true, msg: "Runned Successfully & E-mail Sent (5 min)" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, error: error?.message },
      { status: 500 }
    );
  }
};
