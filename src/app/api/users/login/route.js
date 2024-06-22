import { dbConfig } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

await dbConfig();

export const POST = async (req) => {
  try {
    const { email, password } = await req.json();
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User doesn't exixt");
      return NextResponse.json(
        {
          msg: "User does not exist !",
          success: false,
          code: 2002,
        },
        { status: 500 }
      );
    }
    const passwordIsValid = await bcryptjs.compare(password, user.password);
    if (!passwordIsValid) {
      console.log("Wrong password !");
      return NextResponse.json(
        {
          msg: "Wrong password !",
          success: false,
          code: 2003,
        },
        { status: 500 }
      );
    }
    //! Token
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, {
      expiresIn: "1d",
    });

    const response = NextResponse.json(
      {
        msg: "Successfully Logged In",
        success: true,
        code: 2121,
      },
      {
        status: 200,
      }
    );
    response.cookies.set("token", token, {
      httpOnly: true,
    });
    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        msg: "Something Went Wrong in Login",
        error,
        success: false,
        code: 2001,
      },
      {
        status: 500,
      }
    );
  }
};
