import { dbConfig } from "@/dbConfig/dbConfig";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

await dbConfig();

export const GET = async (req) => {
  try {
    const token = cookies()?.get("token")?.value;
    if (!token)
      return NextResponse.json({ msg: "Unauthorized", error }, { status: 400 });
    try {
      jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (error) {
      console.log(error);
      if (error.message == "invalid token" || "jwt malformed") {
        cookies().delete("token");
      }
      return NextResponse.json({ msg: "Unauthorized", error }, { status: 400 });
    }
    const { searchParams } = new URL(req.url);
    const transactionId = searchParams.get("transactionId");
    if (!transactionId) throw new Error("No Transaction ID");
    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
};
