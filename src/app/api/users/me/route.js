import { tokenToData } from "@/helpers/tokenToData";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

const { dbConfig } = require("@/dbConfig/dbConfig");

dbConfig();

export const GET = async (req) => {
  try {
    const userId = await tokenToData(req);
    const user = await User.findOne({ _id: userId }).select("-password");
    if (user) {
      return NextResponse.json({
        success: true,
        code: 4000,
        msg: "User Found",
        user,
      });
    }
  } catch (error) {
    console.log(error);
    const response = await NextResponse.json(
      { msg: "Something went wrong with token decodation" },
      { status: 501 }
    );
    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    return response;
  }
};
