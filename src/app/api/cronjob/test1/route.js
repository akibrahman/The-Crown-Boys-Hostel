import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const GET = async (req) => {
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return res.status(401).end("Unauthorized");
  }
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
    from: "cron-job@hostelplates.com",
    to: "akibrahman5200@gmail.com",
    subject: "Cron Job",
    html: `<p>
    <p>This is the Prove</p>
    <p>To Date String :${new Date().toDateString()}</p>
    <p>To Time String :${new Date().toTimeString()}</p>
    <p>To Local Date String :${new Date().toLocaleDateString()}</p>
    <p>To Local Time String :${new Date().toLocaleTimeString()}</p>
    <p>To String :${new Date().toString()}</p>
    <p>To Local String :${new Date().toLocaleString()}</p>
    <p>To ISOS String :${new Date().toISOString()}</p>
    </>`,
  };

  await transport.sendMail(mailOptions);
  return NextResponse.json({ success: true });
};
