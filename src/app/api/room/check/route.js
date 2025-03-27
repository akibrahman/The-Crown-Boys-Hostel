import { dbConfig } from "@/dbConfig/dbConfig";
import Room from "@/models/roomModel";
import { NextResponse } from "next/server";

await dbConfig();

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");
    const floor = searchParams.get("floor");
    const building = searchParams.get("building");
    let msg = "Checked!";
    let success = true;
    const room = await Room.findOne({ name, floor });
    const room2 = await Room.findOne({ name, building: { $ne: building } });
    if (room) {
      msg = "Room Already Exists!";
      success = false;
    } else if (room2) {
      msg = "Room Already Exists with Same Name!";
      success = false;
    }

    return NextResponse.json({
      success,
      msg,
      room: room || {},
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, msg: error.message },
      { status: 500 }
    );
  }
};
