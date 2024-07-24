import { dbConfig } from "@/dbConfig/dbConfig";
import Room from "@/models/roomModel";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

await dbConfig();

export const POST = async (req) => {
  try {
    const { userId, stage, floor, roomNumber } = await req.json();
    if (stage == 1) {
      const room = await Room.findOne({
        beds: {
          $elemMatch: {
            user: userId,
          },
        },
      });
      let matchedBed = {};
      if (room) matchedBed = room.beds.find((bed) => bed.user == userId);
      return NextResponse.json({
        success: true,
        isExists: room ? true : false,
        roomName: room ? room.name : "",
        floor: room ? room.floor : "",
        bedNo: room ? matchedBed.bedNo : "",
      });
    } else if (stage == 2) {
      const user = await User.findById(userId);
      if (floor == user.floor && roomNumber == user.roomNumber) {
        return NextResponse.json({
          success: true,
        });
      } else {
        return NextResponse.json({
          success: false,
        });
      }
    } else {
      return NextResponse.json({
        success: false,
        msg: "No Stage Found",
      });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, msg: error.message },
      { status: 500 }
    );
  }
};
