import User from "@/models/userModel";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const body = await req.json();
    const { token } = body;
    console.log(token);
    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });
    if (!user) {
      return NextResponse.json(
        { msg: "Invalid Token Or Expired", success: false },
        { status: 400 }
      );
    }
    console.log(user);
    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();
    return NextResponse.json(
      { msg: "E-mail Verified", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.log("Backend Error!");
    console.log(error);
    return NextResponse.json({ error, success: false });
  }
};
