import Building from "@/models/buildingModel";
import Room from "@/models/roomModel";
import axios from "axios";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import User from "@/models/userModel";

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

    let rooms = await Room.find(query).lean();

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

    rooms = await Promise.all(
      rooms.map(async (room) => {
        const building = await Building.findById(room.building).lean();
        return { ...room, building: building.name };
      })
    );

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
  try {
    const formData = await req.formData();
    const roomName = formData.get("roomName");
    const buildingName = formData.get("buildingName");
    const roomVideo = formData
      .get("roomVideo")
      .replace(/width="\d+"/, `width="350"`)
      .replace(/height="\d+"/, `height="450"`);
    const block = formData.get("block");
    const roomType = formData.get("roomType");
    const roomFloor = parseInt(formData.get("roomFloor"));
    const roomToiletType = formData.get("roomToiletType");
    const roomBalconyState =
      formData.get("roomBalconyState") === "true" ? true : false;
    const roomImage = formData.get("roomImage");
    const roomSketch = formData.get("roomSketch");
    const roomToilet = formData.get("roomToilet");
    const roomBalcony = formData.get("roomBalcony");
    const bedsCount = formData.get("beds");

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

    const sameNameAndFloor = await Room.findOne({
      name: roomName,
      floor: roomFloor,
      managerId: jwtData?.id,
    });
    if (sameNameAndFloor) throw new Error("Room Already Exists!");

    const sameNameButDiffBuilding = await Room.findOne({
      name: roomName,
      building: { $ne: buildingName },
      managerId: jwtData?.id,
    });
    if (sameNameButDiffBuilding)
      throw new Error("Room Already Exists with Same Name!");

    const isSameStructuredRoom = await Room.findOne({
      name: roomName,
      building: buildingName,
      managerId: jwtData?.id,
    }).lean();
    if (isSameStructuredRoom) {
      await new Room({
        ...isSameStructuredRoom,
        _id: undefined,
        floor: roomFloor,
      }).save();
    } else {
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
            file.title === data.title
              ? { ...file, url: uploadResponse.path }
              : file
          );
        } catch (error) {
          throw new Error(error.response.data.msg);
        }
      }
      const bedsForRoom = beds.map((b) => ({
        ...b,
        image: filesToBeUploaded.find(
          (bf) => bf.title === `bedImage-${b.bedNo}`
        ).url,
      }));
      console.log(bedsForRoom);
      await new Room({
        name: roomName,
        managerId: jwtData?.id,
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
    }
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
    const formData = await req.formData();
    const _id = formData.get("_id");
    const roomType = formData.get("roomType");
    const roomToiletType = formData.get("roomToiletType");
    const roomVideo = formData.get("roomVideo");
    const roomBalconyState =
      formData.get("roomBalconyState") === "true" ? true : false;
    const roomImage = formData.get("roomImage");
    const roomSketch = formData.get("roomSketch");
    const roomToilet = formData.get("roomToilet");
    const roomBalcony = formData.get("roomBalcony");
    const bedsCount = formData.get("beds");

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

    const room = await Room.findById(_id);
    if (room.managerId != jwtData?.id)
      throw new Error("Unauthorized, Not Editable!");

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
      if (data.file instanceof File === false) {
        filesToBeUploaded = filesToBeUploaded.map((file) =>
          file.title === data.title ? { ...file, url: data.file } : file
        );
        continue;
      }
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
          file.title === data.title
            ? { ...file, url: uploadResponse.path }
            : file
        );

        let pathParts = "";
        if (data.title.includes("bedImage-")) {
          const bedNo = data.title.split("-")[1];
          const bed = room.beds.find((b) => b.bedNo == bedNo);
          if (bed) {
            pathParts = bed.image.split("/");
            const imagePath = path.join(process.cwd(), "public", ...pathParts);
            fs.unlink(imagePath, (err) => {
              if (err) {
                console.error(`Error deleting folder: ${imagePath}`, err);
              } else {
                console.log(`Successfully deleted folder: ${imagePath}`);
              }
            });
          }
        }
        if (data.title === "Room Image") {
          pathParts = room.image.split("/");
        }
        if (data.title === "Room Sketch") {
          pathParts = room.sketch.split("/");
        }
        if (data.title === "Toilet Image") {
          pathParts = room.toilet.image.split("/");
        }
        if (data.title === "Balcony Image" && roomBalconyState) {
          pathParts = room.balcony.image.split("/");
        }
        if (pathParts) {
          const imagePath = path.join(process.cwd(), "public", ...pathParts);
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.error(`Error deleting folder: ${imagePath}`, err);
            } else {
              console.log(`Successfully deleted folder: ${imagePath}`);
            }
          });
        }
      } catch (error) {
        throw new Error(error.response.data.msg);
      }
    }

    if (room.balcony.balconyState && !roomBalconyState) {
      const imagePathB = path.join(
        process.cwd(),
        "public",
        ...room.balcony.image.split("/")
      );
      fs.unlink(imagePathB, (err) => {
        if (err) {
          console.error(`Error deleting folder: ${imagePathB}`, err);
        } else {
          console.log(`Successfully deleted folder: ${imagePathB}`);
        }
      });
    }

    const bedsForRoom = beds.map((b) => {
      const target = filesToBeUploaded.find(
        (bf) => bf.title === `bedImage-${b.bedNo}`
      );
      return {
        ...b,
        image: target.file instanceof File ? target.url : target.file,
      };
    });

    const deletedBeds = room.beds.filter(
      (roomBed) => !bedsForRoom.some((newBed) => newBed.bedNo === roomBed.bedNo)
    );
    if (deletedBeds.length != 0) {
      deletedBeds.forEach((b) => {
        const imagePathDB = path.join(
          process.cwd(),
          "public",
          ...b.image.split("/")
        );
        fs.unlink(imagePathDB, (err) => {
          if (err) {
            console.error(`Error deleting folder: ${imagePathDB}`, err);
          } else {
            console.log(`Successfully deleted folder: ${imagePathDB}`);
          }
        });
      });
    }

    await Room.findOneAndUpdate(
      { name: room.name, building: room.building, managerId: jwtData?.id },
      {
        $set: {
          type: roomType,
          video: roomVideo,
          "toilet.toiletType": roomToiletType,
          "toilet.image": filesToBeUploaded.find(
            (f) => f.title == "Toilet Image"
          ).url,
          "balcony.balconyState": roomBalconyState,
          "balcony.image": roomBalconyState
            ? filesToBeUploaded.find((f) => f.title == "Balcony Image").url
            : "",
          beds: bedsForRoom,
          sketch: filesToBeUploaded.find((f) => f.title == "Room Sketch").url,
          seats: bedsCount,
          image: filesToBeUploaded.find((f) => f.title == "Room Image").url,
        },
      }
    );

    return NextResponse.json({
      success: true,
      msg: "Room updated successfully",
    });

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

    const room = await Room.findOne({ _id: data._id });
    if (!room) throw new Error("Invalid ID!");
    if (room.managerId != jwtData?.id) throw new Error("Unauthorized!");
    room.beds = data.beds;

    await room.save();

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
