import { dbConfig } from "@/dbConfig/dbConfig";
import { NextResponse } from "next/server";

await dbConfig();

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const cardId = searchParams.get("cardId");
    return NextResponse.json({ cardId, success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
};
