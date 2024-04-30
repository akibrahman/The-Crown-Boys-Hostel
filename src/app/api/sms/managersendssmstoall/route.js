import { dbConfig } from "@/dbConfig/dbConfig";
import { NextResponse } from "next/server";

await dbConfig();

export const POST = async (req) => {
  try {
    const { sms } = await req.json();
    const url = "http://bulksmsbd.net/api/smsapi";
    const apiKey = "WvcwmDFS5UoKaSJ1KJQa";
    const senderId = "8809617618230";
    const numbers = "+8801709605097";
    const message = `Monthly Bill has been created for you Mr. Akib Rahman.\n\nPlease check your E-mail properly with spam box.\n\n${sms}`;
    const data = {
      api_key: apiKey,
      senderid: senderId,
      number: numbers,
      message: message,
    };
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error("SMS can't be sent!");
    }
    // const transport = nodemailer.createTransport({
    //   service: "thecrownboyshostel",
    //   // host: "smtp.gmail.com",
    //   host: "mail.thecrownboyshostel.com",
    //   port: 465,
    //   secure: true,
    //   auth: {
    //     user: "monthly_bill@thecrownboyshostel.com",
    //     pass: "thecrownboyshostel2542",
    //   },
    // });
    // const mailOptions = {
    //   to: "akibrahman5200@gmail.com",
    //   subject: "Test E-mail",
    //   html: `<p>This is a Test E-mail</p>`,
    // };

    // await transport.sendMail(mailOptions);
    return NextResponse.json({ msg: "SMS sent successfully", success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { msg: error.message, success: true },
      { status: 500 }
    );
  }
};
