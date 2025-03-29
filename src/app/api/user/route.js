import { dbConfig } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

await dbConfig();

export const GET = async (req) => {
  try {
    //! Request
    const { searchParams } = new URL(req.url);
    const _id = searchParams.get("_id");
    const name = searchParams.get("name");
    const email = searchParams.get("email");
    const contactNumber = searchParams.get("contactNumber");
    console.log("==============:", email);
    //! Query
    let query = {};
    if (_id) query = { ...query, _id };
    if (name) query = { ...query, username: { $regex: new RegExp(name, "i") } };
    if (email) query = { ...query, email };
    if (contactNumber)
      query = {
        ...query,
        contactNumber,
      };
    //! User
    const user = await User.findOne(query);
    //! Authorization
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
    const client = await User.findById(jwtData?.id);
    if (
      !client ||
      (client.role != "manager" && client._id.toString() != user._id.toString())
    )
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    //! Response
    return NextResponse.json({
      success: true,
      msg: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, msg: error.message },
      { status: 500 }
    );
  }
};
