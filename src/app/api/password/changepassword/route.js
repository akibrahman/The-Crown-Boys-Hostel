import { dbConfig } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";

await dbConfig();

export const POST = async (req) => {
  try {
    const { oldPass, newPass, email } = await req.json();
    console.log(oldPass, newPass, email);
    const user = await User.findOne({ email });
    const passwordIsValid = await bcryptjs.compare(oldPass, user.password);
    if (!passwordIsValid) {
      console.log("Wrong password !");
      return NextResponse.json(
        {
          msg: "Wrong password !",
          success: false,
          code: 2003,
        },
        { status: 401 }
      );
    }
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(newPass, salt);
    user.password = hashPassword;
    await user.save();
    return NextResponse.json({
      msg: "password changed",
      success: true,
    });
  } catch (error) {
    console.log(error);
    console.log(error.message);
    return NextResponse.json(
      {
        msg: error.message,
        code: 1010,
        success: false,
      },
      {
        status: 502,
      }
    );
  }
};
