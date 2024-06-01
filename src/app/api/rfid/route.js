import { dbConfig } from "@/dbConfig/dbConfig";
import RFID from "@/models/rfid";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

await dbConfig();

export const POST = async (req) => {
  try {
    const body = await req.json();
    const isExists = await RFID.findOne({ cardId: body.cardId });
    if (isExists) {
      if (isExists.isIssued) {
        const user = await User.findById(isExists.userId);
        return NextResponse.json({
          msg: `Card is assigned to ${user.username}`,
          success: false,
          code: "402",
        });
      }
      return NextResponse.json({
        msg: "Card is already scanned!",
        success: false,
        code: "401",
      });
    }
    const newRFID = new RFID({
      cardId: body.cardId,
      createdAt: new Date().toISOString("en-US", {
        timeZone: "Asia/Dhaka",
      }),
    });
    await newRFID.save();
    return NextResponse.json({
      msg: "Card scanned successfully",
      success: true,
      code: "200",
    });
  } catch (error) {
    return NextResponse.json(
      {
        msg: error.message,
        success: false,
        code: "500",
      },
      {
        status: 500,
      }
    );
  }
};

export const GET = async () => {
  try {
    const rfids = [];
    const allRfids = await RFID.find();
    for (let i = 0; i < allRfids.length; i++) {
      const singleRfid = await RFID.findById(allRfids[i]._id);
      if (!singleRfid.userId) rfids.push(singleRfid);
      else {
        const userDetails = await User.findById(singleRfid.userId);
        const rfidData = {
          _id: singleRfid._id,
          cardId: singleRfid.cardId,
          userId: singleRfid.userId,
          createdAt: singleRfid.createdAt,
          isIssued: singleRfid.isIssued,
          username: userDetails.username,
          profilePicture: userDetails.profilePicture,
        };
        rfids.push(rfidData);
      }
    }
    return NextResponse.json({
      rfids,
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        msg: error.message,
        success: false,
      },
      {
        status: 500,
      }
    );
  }
};

export const DELETE = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const cardId = searchParams.get("cardId");
    await RFID.deleteOne({ _id: cardId });
    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        msg: error.message,
        success: false,
      },
      {
        status: 500,
      }
    );
  }
};

export const PUT = async (req) => {
  try {
    const { rfidId, userId, action } = await req.json();
    const rfid = await RFID.findById(rfidId);
    const rfidWithUser = await RFID.findOne({ userId });
    if (action == "issue") {
      if (rfidWithUser) {
        return NextResponse.json({
          success: false,
          msg: "User already assigned to a RFID Card",
        });
      }
      rfid.userId = userId;
      rfid.isIssued = true;
      await rfid.save();
      return NextResponse.json({
        success: true,
        msg: "User assigned to RFID Card",
      });
    } else if (action == "remove") {
      rfid.userId = "";
      rfid.isIssued = false;
      await rfid.save();
      return NextResponse.json({
        success: true,
        msg: "User removed from RFID Card",
      });
    } else {
      return NextResponse.json({
        success: false,
        msg: "Invalid action!",
      });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, msg: "Server error", error },
      { status: 500 }
    );
  }
};
