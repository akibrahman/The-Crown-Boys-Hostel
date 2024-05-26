import { NextResponse } from "next/server";

const { dbConfig } = require("@/dbConfig/dbConfig");

await dbConfig();

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const tagId = searchParams.get("tagId");
    const meal = searchParams.get("meal");
    const date = searchParams.get("date");
    const month = searchParams.get("month");
    const year = searchParams.get("year");
    if (!tagId || !meal || !date || !month || !year) {
      return NextResponse.json({ code: 4001, success: false });
    }
    return NextResponse.json({
      code: 2000,
      success: true,
      tagId,
      meal,
      date,
      month,
      year,
    });
  } catch (error) {
    return NextResponse.json({ code: 4002, success: false, error });
  }
};
