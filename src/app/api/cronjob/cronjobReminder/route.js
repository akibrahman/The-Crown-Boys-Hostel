import { dbConfig } from "@/dbConfig/dbConfig";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

await dbConfig();

export const GET = async (req) => {
  try {
    if (
      req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json(
        { success: false, msg: "Unauthorized" },
        { status: 400 }
      );
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
    // MIM SMS
    // Alpha Net BD
    //!!!!!!!!!!!!!!!!!!!!
    const isLastDayOfCurrentMonthInBangladesh = () => {
      const today = new Date();
      today.setUTCHours(today.getUTCHours() + 6);
      const currentMonth = today.getUTCMonth();
      const currentYear = today.getUTCFullYear();
      const lastDayOfMonth = new Date(
        Date.UTC(currentYear, currentMonth + 1, 0)
      );
      return {
        isLastDay:
          today.getUTCDate() === lastDayOfMonth.getUTCDate() &&
          today.getUTCMonth() === lastDayOfMonth.getUTCMonth() &&
          today.getUTCFullYear() === lastDayOfMonth.getUTCFullYear(),
      };
    };
    //!!!!!!!!!!!!!!!!!!!!
    const isSecondLastDayOfCurrentMonthInBangladesh = () => {
      const today = new Date();
      today.setUTCHours(today.getUTCHours() + 6);
      const currentMonth = today.getUTCMonth();
      const currentYear = today.getUTCFullYear();
      // const currentHour = today.getUTCHours();
      // const currentMinute = today.getUTCMinutes();
      const lastDayOfMonth = new Date(
        Date.UTC(currentYear, currentMonth + 1, 0)
      );
      const secondLastDayOfMonth = new Date(lastDayOfMonth);
      secondLastDayOfMonth.setUTCDate(lastDayOfMonth.getUTCDate() - 1);
      console.log(secondLastDayOfMonth);
      return {
        isSecondLastDay:
          today.getUTCDate() === secondLastDayOfMonth.getUTCDate() &&
          today.getUTCMonth() === secondLastDayOfMonth.getUTCMonth() &&
          today.getUTCFullYear() === secondLastDayOfMonth.getUTCFullYear(),
      };
    };
    const test = true;
    const aboutSecondLastDayOfCurrentMonth =
      isSecondLastDayOfCurrentMonthInBangladesh();
    const aboutLastDayOfCurrentMonth = isLastDayOfCurrentMonthInBangladesh();
    async function delay(s) {
      await new Promise((resolve) => setTimeout(resolve, s * 1000));
      console.log("Delayed function executed!!!!");
    }
    if (test) {
      console.log("-------------------> Started");
      // const testArray = ["01709605097", "01521787402"];
      // await delay(60000);
      const currentDate = new Date().toLocaleDateString("en-US", {
        timeZone: "Asia/Dhaka",
      });
      const currentTime = new Date().toLocaleTimeString("en-US", {
        timeZone: "Asia/Dhaka",
      });
      const currentMonth = new Date().toLocaleDateString("en-BD", {
        month: "long",
        timeZone: "Asia/Dhaka",
      });
      const currentYear = new Date().toLocaleDateString("en-BD", {
        year: "numeric",
        timeZone: "Asia/Dhaka",
      });
      const mailOptionsTest = {
        to: "akibrahman5200@gmail.com",
        subject: "Test E-mail from SMTP",
        html: `<div>
          <p><b>Current Month : ${currentMonth}</b></p>
          <p><b>Current Year : ${currentYear}</b></p>
          <p><b>Current Date : ${currentDate}</b></p>
          <p><b>Current Time : ${currentTime}</b></p>
          </div>`,
      };
      await transport.sendMail(mailOptionsTest);

      // const allUsers = await User.find({ role: "client" });
      // for (let x = 0; x < allUsers.length; x++) {
      //   //! SMS
      //   const url = "http://bulksmsbd.net/api/smsapi";
      //   const apiKey = process.env.SMS_API_KEY;
      //   const senderId = "8809617618230";
      //   const numbers = allUsers[x].contactNumber;
      //   // const message = `Hi, Mr. Akib Rahman\nYour monthly bill has been created\nPlease check your E-mail properly with spam box to get details.\n\nThe Crown Boys Hostel`;
      //   const message = `Hi, Mr. ${allUsers[x].username}\nGood Evening\n\nThe Crown Boys Hostel`;
      //   const smsClientData = {
      //     api_key: apiKey,
      //     senderid: senderId,
      //     number: numbers,
      //     message: message,
      //   };
      //   const ress = await fetch(url, {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify(smsClientData),
      //   });
      //   console.log(ress.ok);
      //   //! SMS
      //   await delay(1000);
      //   const mailOptions = {
      //     to: allUsers[x].email,
      //     subject: "Test E-mail from Akib Rahman",
      //     html: `<div>
      //     <p><b>Current Month : ${currentMonth}</b></p>
      //     <p><b>Current Year : ${currentYear}</b></p>
      //     <p><b>Current Date : ${currentDate}</b></p>
      //     <p><b>Current Time : ${currentTime}</b></p>
      //     </div>`,
      //   };
      //   await transportGmail.sendMail(mailOptions);
      //   await delay(1000);
      // }
      console.log("-------------------> Ended");
    }
    //! Last day of any month------------------------------
    //! Second Last day of any month-----------------------

    if (true) {
      console.log("-------------------> sTARTED tARGET");
      const lastDayOfMonthEmail = {
        to: "akibrahman5200@gmail.com",
        subject: "Last Day Execution Reminder",
        html: `<div>
              <p><b>You have to press the cron job button today</b></p>
              <p><b>Current Month : ${currentMonth}</b></p>
              <p><b>Current Year : ${currentYear}</b></p>
              <p><b>Current Date : ${currentDate}</b></p>
              <p><b>Current Time : ${currentTime}</b></p>
              </div>`,
      };
      await transport.sendMail(lastDayOfMonthEmail);
      const url = "http://bulksmsbd.net/api/smsapi";
      const apiKey = process.env.SMS_API_KEY;
      const senderId = "8809617618230";
      const numbers = "01709605097";
      const message = `Hi, Mr. Akib Rahman\nYou have to press the cron job button today.\n\nThe Crown Boys Hostel`;
      const lastdayOfMonthSMS = {
        api_key: apiKey,
        senderid: senderId,
        number: numbers,
        message: message,
      };
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(lastdayOfMonthSMS),
      });
    }

    return NextResponse.json({ success: true, msg: "Runned successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
};
