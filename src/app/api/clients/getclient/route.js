import { dbConfig } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

dbConfig();

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const client = await User.findById(id);
    return NextResponse.json({ client, success: true });
  } catch (error) {
    console.log("+", error);
    return NextResponse.json(
      { msg: "Backend Error when finding client" },
      { status: 500 }
    );
  }
};
