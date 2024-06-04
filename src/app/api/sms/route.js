import { dbConfig } from "@/dbConfig/dbConfig";
import { NextResponse } from "next/server";

await dbConfig();

export const POST = async (req) => {
  try {
    const { msg, sendState, receiver } = await req.json();
    // console.log(msg, sendState, receiver);
    //
    const url = "http://bulksmsbd.net/api/smsapi";
    const apiKey = process.env.SMS_API_KEY;
    const senderId = "8809617618230";
    const numbers = receiver.map((r) => r.number).join(",");
    const data = {
      api_key: apiKey,
      senderid: senderId,
      number: numbers,
      message: msg,
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
    //
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
