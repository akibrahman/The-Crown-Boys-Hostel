import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const GET = async (req) => {
  try {
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
    //!!!!!!!!!!!!!!!!!!!!
    function isSecondLastDayOfCurrentMonthInBangladesh() {
      const today = new Date();
      today.setUTCHours(today.getUTCHours() + 6);
      const currentMonth = today.getUTCMonth();
      const currentYear = today.getUTCFullYear();
      const currentHour = today.getUTCHours();
      const currentMinute = today.getUTCMinutes();
      const lastDayOfMonth = new Date(
        Date.UTC(currentYear, currentMonth + 1, 0)
      );
      const secondLastDayOfMonth = new Date(lastDayOfMonth);
      secondLastDayOfMonth.setUTCDate(lastDayOfMonth.getUTCDate() - 4);
      console.log(secondLastDayOfMonth);
      return {
        isSecondLastDay:
          today.getUTCDate() === secondLastDayOfMonth.getUTCDate() &&
          today.getUTCMonth() === secondLastDayOfMonth.getUTCMonth() &&
          today.getUTCFullYear() === secondLastDayOfMonth.getUTCFullYear(),
        secondLastDayOfMonth,
        lastDayOfMonth,
        currentHour,
        currentMinute,
      };
    }
    const testData = isSecondLastDayOfCurrentMonthInBangladesh();

    const mailOptions = {
      from: "cron-job@hostelplates.com",
      to: "akibrahman5200@gmail.com",
      subject: "Cron Job",
      html: `<div>
        <p>Is Second Last Day :${testData.isSecondLastDay}</p>
        <p>Second Last Day Of Month :${testData.secondLastDayOfMonth}</p>
        <p>Last Day Of Month :${testData.lastDayOfMonth}</p>
        <p>Current Hour :${testData.currentHour}</p>
        <p>Current Minute :${testData.currentMinute}</p>
        </div>`,
    };

    await transport.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
