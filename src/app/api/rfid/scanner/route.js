import { dbConfig } from "@/dbConfig/dbConfig";
import { NextResponse } from "next/server";

await dbConfig();

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const cardId = searchParams.get("cardId");
    const meal = searchParams.get("meal");
    const date = searchParams.get("date");
    const month = searchParams.get("month");
    const year = searchParams.get("year");
    return NextResponse.json({
      cardId,
      meal,
      date,
      month,
      year,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
};
