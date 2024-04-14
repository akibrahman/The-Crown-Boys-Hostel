import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    return NextResponse.json({ msg: "OK", success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { msg: "Backend Error", error, success: false },
      { status: 500 }
    );
  }
};
