import { dbConfig } from "@/dbConfig/dbConfig";
import { NextResponse } from "next/server";

await dbConfig();

export const GET = async (req) => {
  try {
    return NextResponse.json({ success: true, data: { msg: "All Working" } });
  } catch (error) {
    return NextResponse.json({ msg: error.message }, { status: 500 });
  }
};
