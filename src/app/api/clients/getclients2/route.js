import { dbConfig } from "@/dbConfig/dbConfig";
import { NextResponse } from "next/server";

dbConfig();

export const GET = async (req) => {
  try {
    const { email } = req.query;
    console.log("Query parameters:", req.query);
    // const { searchParams } = new URL(req.url);
    // const id = searchParams.get("id");
    // const clients = await User.find({ isClient: true, manager: id });
    // return NextResponse.json({ clients, success: true });
    return NextResponse.json({ success: true, email });
  } catch (error) {
    return NextResponse.json(
      { msg: "Backend Error when finding clients" },
      { status: 500 }
    );
  }
};
