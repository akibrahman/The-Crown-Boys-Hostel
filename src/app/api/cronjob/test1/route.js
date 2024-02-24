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
    function isSixthLastDayOfCurrentMonthInBangladesh() {
      const today = new Date();
      today.setUTCHours(today.getUTCHours() + 6);
      const currentMonth = today.getUTCMonth();
      const currentYear = today.getUTCFullYear();
      const currentHour = today.getUTCHours();
      const currentMinute = today.getUTCMinutes();
      const lastDayOfMonth = new Date(
        Date.UTC(currentYear, currentMonth + 1, 0)
      );
      const sixthLastDayOfMonth = new Date(lastDayOfMonth);
      sixthLastDayOfMonth.setUTCDate(lastDayOfMonth.getUTCDate() - 5);
      console.log(sixthLastDayOfMonth);
      return {
        isLastSixthDay:
          today.getUTCDate() === sixthLastDayOfMonth.getUTCDate() &&
          today.getUTCMonth() === sixthLastDayOfMonth.getUTCMonth() &&
          today.getUTCFullYear() === sixthLastDayOfMonth.getUTCFullYear(),
        sixthLastDayOfMonth,
        lastDayOfMonth,
        currentHour,
        currentMinute,
      };
    }
    const testData = isSixthLastDayOfCurrentMonthInBangladesh();

    const mailOptions = {
      from: "cron-job@hostelplates.com",
      to: "akibrahman5200@gmail.com",
      subject: "Cron Job",
      html: `<div>
        <p>Is Last Sixth Day :${testData.isLastSixthDay}</p>
        <p>Sixth Last Day Of Month :${testData.sixthLastDayOfMonth}</p>
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
