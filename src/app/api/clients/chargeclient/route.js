import User from "@/models/userModel";
import { NextResponse } from "next/server";

const { dbConfig } = require("@/dbConfig/dbConfig");

await dbConfig();

export const PUT = async (req) => {
  try {
    const { chargeData, _id } = await req.json();
    const user = await User.findById(_id);
    user.charges = [...user.charges, chargeData];
    await user.save();
    return NextResponse.json({ success: true, msg: "User Updated" });
  } catch (error) {
    return NextResponse.json(
      { success: false, msg: "Server error!" },
      { status: 500 }
    );
  }
};
