import Room from "@/models/roomModel";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import User from "@/models/userModel";

const { dbConfig } = require("@/dbConfig/dbConfig");

await dbConfig();

export const POST = async (req) => {
  try {
    const { floors, roomId } = await req.json();

    const token = cookies()?.get("token")?.value;
    let jwtData;
    try {
      jwtData = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (error) {
      console.log(error);
      if (error.message == "invalid token" || "jwt malformed") {
        cookies().delete("token");
      }
      return NextResponse.json({ msg: "Unauthorized", error }, { status: 401 });
    }
    const manager = await User.findById(jwtData?.id);
    if (!manager || manager.role != "manager")
      return NextResponse.json({ msg: "Unauthorized", error }, { status: 401 });

    if (!roomId || !floors || floors.length <= 0)
      throw new Error("Invalid Payload!");
    const room = await Room.findOne({
      _id: roomId,
      managerId: jwtData.id,
    }).lean();
    if (!room) throw new Error("Invalid Room ID!");

    await Promise.all(
      floors.map(async (floor) => {
        await new Room({
          ...room,
          _id: undefined,
          floor: parseInt(floor),
        }).save();
      })
    );
    console.log("------------------------------");
    return NextResponse.json({ success: true, msg: "Room added successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, msg: error.message },
      { status: 500 }
    );
  }
};
