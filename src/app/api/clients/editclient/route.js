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
export const PATCH = async (req) => {
  try {
    const { id } = await req.json();
    const user = await User.findById(id);
    user.charges = [...user.charges, { wifi: 200 }];
    await user.save();
    return NextResponse.json({ success: true, msg: "Test success" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, msg: "Server error!" },
      { status: 500 }
    );
  }
};
