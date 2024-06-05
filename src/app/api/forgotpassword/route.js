import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const body = await req.json();
    const { token, pass } = body;
    const user = await User.findOne({
      forgotPasswordToken: token,
      forgotPasswordTokenExpiry: { $gt: Date.now() },
    });
    if (!user) {
      return NextResponse.json(
        { msg: "Invalid Token Or Expired", success: false },
        { status: 400 }
      );
    }
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(pass, salt);
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;
    user.password = hashPassword;
    await user.save();
    return NextResponse.json(
      { msg: "Password changed", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.log("Backend Error!");
    console.log(error);
    return NextResponse.json({ error, success: false });
  }
};
