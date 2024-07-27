import User from "@/models/userModel";
import { NextResponse } from "next/server";

const { dbConfig } = require("@/dbConfig/dbConfig");

await dbConfig();

export const POST = async (req) => {
  try {
    const { id } = await req.json();
    const nextUser = await User.findOne({
      _id: { $gt: id },
      isClient: true,
      isClientVerified: true,
    })
      .sort({ _id: 1 })
      .select("_id")
      .exec();
    return NextResponse.json({
      success: true,
      msg: "Next user fetched",
      nextId: nextUser ? nextUser._id : null,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      msg: "Next user fetch server error",
    });
  }
};
