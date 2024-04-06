import { dbConfig } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

dbConfig();

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const onlyApproved = searchParams.get("onlyApproved");
    if (onlyApproved === "1") {
      const clients = await User.find({
        isClient: true,
        manager: id,
        isClientVerified: true,
      });
      return NextResponse.json({ clients, success: true });
    } else {
      const clients = await User.find({
        isClient: true,
        manager: id,
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
