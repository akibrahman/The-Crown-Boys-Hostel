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
    return NextResponse.json({ msg: "SMS sent successfully", success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { msg: error.message, success: true },
      { status: 500 }
    );
  }
};

export const GET = async () => {
  try {
    const smsApi = process.env.SMS_API_KEY;
    if (!smsApi) throw new Error("API not found!");
    const url = `http://bulksmsbd.net/api/getBalanceApi?api_key=${smsApi}`;
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`Failed to fetch: ${response.statusText}`);
    const data = await response.json();
    return NextResponse.json({
      success: true,
      balance: data.balance,
      msg: "Balance Retrived Successfully",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error, success: false, msg: "Server Error1" },
      { status: 500 }
    );
  }
};
