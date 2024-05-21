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
    return NextResponse.json({
      success: true,
      msg: "Charge added to the user",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, msg: "Server error!" },
      { status: 500 }
    );
  }
};

export const PATCH = async (req) => {
  try {
    const { note, _id } = await req.json();
    const user = await User.findById(_id);
    user.charges = user.charges.filter((crg) => crg.note != note);
    await user.save();
    return NextResponse.json({ success: true, msg: "Charge deleted" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, msg: "Server error!" },
      { status: 500 }
    );
  }
};
