import { tokenToData } from "@/helpers/tokenToData";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

const { dbConfig } = require("@/dbConfig/dbConfig");

await dbConfig();

export const GET = async (req) => {
  try {
    const userId = await tokenToData(req);
    if (!userId) {
      const response = NextResponse.json({
        msg: "Unauthorized",
        success: false,
      });
      response.cookies.set("token", "", {
        httpOnly: true,
        expires: new Date(0),
      });
      return response;
    }
    const user = await User.findOne({ _id: userId }).select("-password");
    if (user) {
      return NextResponse.json({
        success: true,
        code: 4000,
        msg: "User Found",
        user,
        success: true,
      });
    } else {
      const response = NextResponse.json({
        msg: "Unauthorized",
        success: false,
      });
      response.cookies.set("token", "", {
        httpOnly: true,
        expires: new Date(0),
      });
      return response;
    }
  } catch (error) {
    const response = NextResponse.json(
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
