import Room from "@/models/roomModel";
import axios from "axios";
import { NextResponse } from "next/server";

const { dbConfig } = require("@/dbConfig/dbConfig");

await dbConfig();

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all");
    const id = searchParams.get("id");
    const name = searchParams.get("name");
    const floor = searchParams.get("floor");
    const filter = searchParams.get("filter");
    let page = parseInt(searchParams.get("page") || 0);

    let skip = 0;
    let limit = 5;

    if (all && (all == "true" || all == true)) {
      skip = 0;
      limit = 9999;
    } else {
      skip = page * limit;
    }

    let query = {};
    if (id) query = { ...query, _id: id };
    if (name) query = { ...query, name };
    if (floor) query = { ...query, floor: parseInt(floor) };

    let rooms = await Room.find(query);

    if (filter) {
      if (filter == "br") {
        rooms = rooms.filter((room) =>
          room.beds.every((bed) => bed.isBooked == true)
        );
      } else if (filter == "fr") {
        rooms = rooms.filter((room) =>
          room.beds.every((bed) => bed.isBooked == false)
        );
      } else if (filter == "as") {
        rooms = rooms.filter((room) =>
          room.beds.some((bed) => bed.isBooked == false)
        );
      }
    }

    const finalRooms = rooms.slice(skip, skip + limit);

    return NextResponse.json({
      success: true,
      msg: "Rooms fetched successfully",
      rooms: finalRooms,
      count: rooms.length,
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
  const formData = await req.formData();
  const roomName = formData.get("roomName");
  const buildingName = formData.get("buildingName");
  const roomVideo = formData.get("roomVideo");
  const block = formData.get("block");
  const roomType = formData.get("roomType");
  const roomFloor = formData.get("roomFloor");
  const roomToiletType = formData.get("roomToiletType");
  const roomBalconyState =
    formData.get("roomBalconyState") === "true" ? true : false;
  const roomImage = formData.get("roomImage");
  const roomSketch = formData.get("roomSketch");
  const roomToilet = formData.get("roomToilet");
  const roomBalcony = formData.get("roomBalcony");
  const bedsCount = formData.get("beds");
  let beds = [];
  let i = 0;
  let filesToBeUploaded = [
    { title: "Room Image", file: roomImage, url: "" },
    { title: "Room Sketch", file: roomSketch, url: "" },
    { title: "Toilet Image", file: roomToilet, url: "" },
  ];
  if (roomBalconyState)
    filesToBeUploaded.push({
      title: "Balcony Image",
      file: roomBalcony,
      url: "",
    });
  for (i = 1; i <= parseInt(bedsCount); i++) {
    let bed = JSON.parse(formData.get(`bedData-${i}`));
    let bedImage = formData.get(`bedImage-${i}`);
    bed["image"] = bedImage;
    beds.push(bed);
    filesToBeUploaded.push({
      title: `bedImage-${bed.bedNo}`,
      file: bedImage,
      url: "",
    });
  }
  for (i = 1; i <= filesToBeUploaded.length; i++) {
    const data = filesToBeUploaded[i - 1];
    const dataForImageUrl = new FormData();
    dataForImageUrl.append("file", data.file);
    dataForImageUrl.append("path", `/rooms`);
    dataForImageUrl.append("size", "5");
    dataForImageUrl.append("fileType", "jpg,png,jpeg,webp");
    dataForImageUrl.append("securityCode", process.env.TOKEN_SECRET);
    try {
      const { data: uploadResponse } = await axios.post(
        `${process.env.BASE_URL}/api/singleFileUpload`,
        dataForImageUrl
      );
      if (!uploadResponse.success) throw new Error(data.msg);
      filesToBeUploaded = filesToBeUploaded.map((file) =>
        file.title === data.title ? { ...file, url: uploadResponse.path } : file
      );
    } catch (error) {
      throw new Error(error.response.data.msg);
    }
  }
  const bedsForRoom = beds.map((b) => ({
    ...b,
    image: filesToBeUploaded.find((bf) => bf.title === `bedImage-${b.bedNo}`)
      .url,
  }));
  await new Room({
    name: roomName,
    building: buildingName,
    floor: parseInt(roomFloor),
    video: roomVideo,
    block: block,
    type: roomType,
    sketch: filesToBeUploaded.find((f) => f.title == "Room Sketch").url,
    seats: bedsCount,
    toilet: {
      toiletType: roomToiletType,
      image: filesToBeUploaded.find((f) => f.title == "Toilet Image").url,
    },
    balcony: {
      balconyState: roomBalconyState,
      image: roomBalconyState
        ? filesToBeUploaded.find((f) => f.title == "Balcony Image").url
        : "",
    },
    image: filesToBeUploaded.find((f) => f.title == "Room Image").url,
    beds: bedsForRoom,
  }).save();
  return NextResponse.json({ success: true, msg: "Room added successfully" });
  try {
    const data = await req.json();
    await new Room({
      name: data.roomName,
      building: data.buildingName,
      floor: parseInt(data.roomFloor),
      video: { src: data.roomVideoData.src, path: data.roomVideoData.path },
      // block: data.roomName.split("")[0] == "a" ? "a" : "b",
      block: data.block,
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
