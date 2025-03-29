import { dbConfig } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

await dbConfig();

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const _id = searchParams.get("_id");
    const name = searchParams.get("name");
    const email = searchParams.get("email");
    const contactNumber = searchParams.get("contactNumber");

    let query = {};
    if (_id) query = { ...query, _id };
    if (name) query = { ...query, username: { $regex: new RegExp(name, "i") } };
    if (email) query = { ...query, email: { $regex: new RegExp(email, "i") } };
    if (contactNumber)
      query = {
        ...query,
        contactNumber: { $regex: new RegExp(contactNumber, "i") },
      };

    const user = await User.findOne(query);
    console.log(user);
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
