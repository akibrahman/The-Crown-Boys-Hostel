import axios from "axios";
import { NextResponse } from "next/server";

const { dbConfig } = require("@/dbConfig/dbConfig");

await dbConfig();

export const POST = async (req) => {
  try {
    const { email } = await req.json();

    const apiKey =
      "cc1d79b70183ea0c9219756579c3fbe0e67e45d58e4372c8d47a418a096b";
    const { data } = await axios.get(
      `https://api.quickemailverification.com/v1/verify?email=${email}&apikey=${apiKey}`
    );
    console.log(data);
    if (data.result === "valid" && data.success === "true") {
      return NextResponse.json({ success: true, valid: true });
    } else {
      return NextResponse.json({ success: false, valid: false });
    }
  } catch (error) {
    console.log("====>", error);
    return NextResponse.json({ success: false, valid: false }, { status: 500 });
  }
};
