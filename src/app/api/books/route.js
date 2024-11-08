import { dbConfig } from "@/dbConfig/dbConfig";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/userModel";
import Book from "@/models/bookModel";

await dbConfig();

export const GET = async (req) => {
  try {
    const token = cookies()?.get("token")?.value;
    let jwtData;
    try {
      jwtData = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (error) {
      console.log(error);
      if (error.message == "invalid token" || "jwt malformed") {
        cookies().delete("token");
      }
      return NextResponse.json({ msg: "Unauthorized", error }, { status: 401 });
    }

    const manager = await User.findById(jwtData?.id);
    if (!manager || manager.role != "manager")
      return NextResponse.json({ msg: "Unauthorized", error }, { status: 401 });

    const books = await Book.find({ managerId: jwtData.id });

    return NextResponse.json({ success: true, books });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
};
