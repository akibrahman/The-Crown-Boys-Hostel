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

    const room = await Room.findOne({ name, floor, building });

    return NextResponse.json({
      success: room ? false : true,
      msg: room ? "Room Exists!" : "Checked",
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
