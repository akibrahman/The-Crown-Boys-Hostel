import User from "@/models/userModel";
import { NextResponse } from "next/server";

const { dbConfig } = require("@/dbConfig/dbConfig");

await dbConfig();

export const PUT = async (req) => {
  try {
    const { changedData, _id } = await req.json();
    await User.findOneAndUpdate({ _id }, changedData);
    return NextResponse.json({ success: true, msg: "User Updated" });
  } catch (error) {
    return NextResponse.json(
      { success: false, msg: "Server error!" },
      { status: 500 }
    );
  }
};
