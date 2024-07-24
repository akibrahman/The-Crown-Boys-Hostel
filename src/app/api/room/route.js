import Room from "@/models/roomModel";
import { NextResponse } from "next/server";

const { dbConfig } = require("@/dbConfig/dbConfig");

await dbConfig();

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const name = searchParams.get("name");
    const floor = searchParams.get("floor");
    let query = {};
    if (id) query = { ...query, _id: id };
    if (name) query = { ...query, name };
    if (floor) query = { ...query, floor: parseInt(floor) };
    const rooms = await Room.find(query);
    return NextResponse.json({
      success: true,
      msg: "Rooms fetched successfully",
      rooms,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, msg: error.message },
      { status: 500 }
    );
  }
};

export const POST = async (req) => {
  try {
    const data = await req.json();
    await new Room({
      name: data.roomName,
      floor: parseInt(data.roomFloor),
      video: { src: data.roomVideoData.src, path: data.roomVideoData.path },
      block: data.roomName.split("")[0] == "a" ? "a" : "b",
      type: data.roomType,
      sketch: { src: data.roomSketchData.src, path: data.roomSketchData.path },
      seats: data.roomBeds.length,
      toilet: {
        toiletType: data.roomToiletType,
        image: {
          src: data.roomToiletImageData.src,
          path: data.roomToiletImageData.path,
        },
      },
      balcony: {
        balconyState: data.roomBalconyState,
        image: {
          src: data.roomBalconyState ? data.roomBalconyImageData.src : "",
          path: data.roomBalconyState ? data.roomBalconyImageData.path : "",
        },
      },
      image: { src: data.roomImageData.src, path: data.roomImageData.path },
      beds: data.roomBeds,
    }).save();
    return NextResponse.json({ success: true, msg: "Room added successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, msg: error.message },
      { status: 500 }
    );
  }
};

export const PUT = async (req) => {
  try {
    const data = await req.json();
    await Room.findByIdAndUpdate(data._id, {
      $set: {
        name: data.roomName,
        type: data.roomType,
        floor: parseInt(data.roomFloor),
        "toilet.toiletType": data.roomToiletType,
        "balcony.balconyState": data.roomBalconyState,
        beds: data.roomBeds,
        seats: data.roomBeds.length,
      },
    });

    return NextResponse.json({
      success: true,
      msg: "Room updated successfully",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, msg: error.message },
      { status: 500 }
    );
  }
};
export const PATCH = async (req) => {
  try {
    const data = await req.json();
    await Room.findByIdAndUpdate(data._id, {
      beds: data.beds,
    });

    return NextResponse.json({
      success: true,
      msg: "Room updated successfully",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, msg: error.message },
      { status: 500 }
    );
  }
};

export const DELETE = async (req) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  try {
    await Room.findByIdAndDelete(id);
    const existingRooms = await Room.find({ name });
    return NextResponse.json({
      success: true,
      msg: "Room deleted successfully",
      count: existingRooms.length,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, msg: error.message },
      { status: 500 }
    );
  }
};
