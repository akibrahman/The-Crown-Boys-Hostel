import User from "@/models/userModel";
import { NextResponse } from "next/server";

const { dbConfig } = require("@/dbConfig/dbConfig");

await dbConfig();

export const POST = async (req) => {
  try {
    const { id } = await req.json();
    const prevUser = await User.findOne({
      _id: { $lt: id },
      isClient: true,
      isClientVerified: true,
    })
      .sort({ _id: -1 })
      .select("_id")
      .exec();
    return NextResponse.json({
      success: true,
      msg: "Previous user fetched",
      prevId: prevUser ? prevUser._id : null,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      msg: "Previous user fetch server error",
    });
  }
};
