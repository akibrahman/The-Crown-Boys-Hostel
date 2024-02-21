import { dbConfig } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

dbConfig();

export const GET = async () => {
  try {
    const managers = await User.find({ isManager: true });
    return NextResponse.json({ managers, success: true });
  } catch (error) {
    return NextResponse.json({ msg: "Backend Error" }, { status: 500 });
  }
};
