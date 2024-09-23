import { dbConfig } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

dbConfig();

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const onlyApproved = searchParams.get("onlyApproved");
    const clientName = searchParams.get("clientName");
    const regexPattern = new RegExp(clientName, "i");
    if (!id) {
      console.log("Yes, Traget");
      const clients = await User.find({
        isClient: true,
        isClientVerified: true,
      });
      return NextResponse.json({ clients, success: true });
    }
    //! For User's Query
    if (onlyApproved === "1") {
      const clients = await User.find({
        isClient: true,
        manager: id,
        isClientVerified: true,
        username: regexPattern,
      });
      return NextResponse.json({ clients, success: true });
    }
    //! For Manager's Profile
    else {
      const clients = await User.find({
        isClient: true,
        manager: id,
        username: regexPattern,
      });
      return NextResponse.json({ clients, success: true });
    }
  } catch (error) {
    return NextResponse.json(
      { msg: "Backend Error when finding clients" },
      { status: 500 }
    );
  }
};
