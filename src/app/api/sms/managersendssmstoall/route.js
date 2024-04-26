import { dbConfig } from "@/dbConfig/dbConfig";
import { NextResponse } from "next/server";

await dbConfig();

export const POST = async (req) => {
  try {
    const { sms } = await req.json();
    const url = "http://bulksmsbd.net/api/smsapi";
    const apiKey = "WvcwmDFS5UoKaSJ1KJQa";
    const senderId = "8809617618230";
    const numbers = "8801709605097";
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
    console.log(res);
    if (res?.ok)
      return NextResponse.json({ msg: "SMS sent successfully", success: true });
    else throw new Error("SMS can't be sent!");
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { msg: error.message, success: true },
      { status: 500 }
    );
  }
};
