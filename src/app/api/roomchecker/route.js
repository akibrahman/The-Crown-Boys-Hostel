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

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    let pipeline = [
      {
        $unwind: "$beds",
      },
      {
        $match: { "beds.user": userId },
      },
      {
        $group: {
          _id: null,
          totalUserRent: { $sum: "$beds.userRent" },
        },
      },
    ];

    const result = await Room.aggregate(pipeline);

    const totalRent = result.length > 0 ? result[0].totalUserRent : 0;

    return NextResponse.json({ totalRent, success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
};
