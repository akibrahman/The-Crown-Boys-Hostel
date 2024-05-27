import { NextResponse } from "next/server";

const { dbConfig } = require("@/dbConfig/dbConfig");

await dbConfig();

export const POST = async (req) => {
  try {
    const body = await req.json();
    const tagId = body.tagId;
    const meal = body.meal;
    const date = body.date;
    const month = body.month;
    const year = body.year;
    if (!tagId || !meal || !date || !month || !year) {
      return NextResponse.json({ code: 4001, success: false });
    }
    return NextResponse.json({
      success: true,
      "E3 23 AB 15": "true",
      "43 1A 23 17": "true",
    });
  } catch (error) {
    return NextResponse.json({ code: 4002, success: false, error });
  }
};
