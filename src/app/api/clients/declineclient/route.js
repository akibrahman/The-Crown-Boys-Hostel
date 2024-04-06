import User from "@/models/userModel";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const { id } = await req.json();
    await User.findOneAndDelete({ _id: id });
    return NextResponse.json(
      { msg: "Deleted", success: true },
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
