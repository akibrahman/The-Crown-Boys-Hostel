import User from "@/models/userModel";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const { id } = await req.json();
    await User.findOneAndUpdate(
      { _id: id },
      { $set: { isClientVerified: true } }
    );
    return NextResponse.json(
      { msg: "Authorization provided as Client", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { msg: "Backend Problem", success: false },
      { status: 500 }
    );
  }
};
