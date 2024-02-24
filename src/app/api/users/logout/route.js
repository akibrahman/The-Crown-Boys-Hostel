import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const response = NextResponse.json(
      {
        msg: "Successfully logged out",
        success: true,
        code: 3050,
      },
      { status: 200 }
    );
    cookies().delete("token");
    // response.cookies.set("token", "", {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: true,
    //   expires: new Date(0),
    // });
    return response;
  } catch (error) {
    return NextResponse.json(
      {
        msg: "Something went wrong when logging out",
        success: false,
        code: 3001,
      },
      { status: 501 }
    );
  }
};
