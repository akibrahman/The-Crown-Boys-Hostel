import { dbConfig } from "@/dbConfig/dbConfig";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/userModel";
import Building from "@/models/buildingModel";
import axios from "axios";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import Room from "@/models/roomModel";

await dbConfig();

export const POST = async (req) => {
  try {
    const formData = await req.formData();
    const name = formData.get("name");
    const location = formData.get("location");
    const floorsCount = formData.get("floorsCount");
    const sqFt = formData.get("sqFt");
    const buildingImage = formData.get("buildingImage");
    if (!name) throw new Error("Building name is required");
    if (!buildingImage) throw new Error("Building image is required");
    const token = cookies()?.get("token")?.value;
    if (!token)
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    let jwtData;
    try {
      jwtData = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (error) {
      console.log(error);
      cookies().delete("token");
      return NextResponse.json({ msg: "Unauthorized", error }, { status: 401 });
    }
    const manager = await User.findById(jwtData?.id);
    if (!manager || manager.role !== "manager") {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    // Create a new building
    const newBuilding = new Building({
      managerId: jwtData.id,
      name,
      location: location || "",
      floorsCount: floorsCount || "G + n",
      sqFt: sqFt || 500,
      buildingImage: "",
    });
    await newBuilding.save();

    const dataForImageUrl = new FormData();
    dataForImageUrl.append("file", buildingImage);
    dataForImageUrl.append("path", `/building/${newBuilding._id}`);
    dataForImageUrl.append("size", "5");
    dataForImageUrl.append("fileType", "jpg,png,jpeg,webp");
    dataForImageUrl.append("securityCode", process.env.TOKEN_SECRET);
    try {
      const { data } = await axios.post(
        `${process.env.BASE_URL}/api/singleFileUpload`,
        dataForImageUrl
      );
      if (!data.success) throw new Error(data.msg);
      await Building.findByIdAndUpdate(newBuilding._id, {
        buildingImage: data.path,
      });
    } catch (error) {
      await Building.findByIdAndDelete(newBuilding._id);
      throw new Error(error);
    }

    return NextResponse.json({
      success: true,
      msg: `${name} - Building Created`,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, error, msg: error.message },
      { status: 500 }
    );
  }
};

export const PATCH = async (req) => {
  try {
    const formData = await req.formData(); // Get form data
    const _id = formData.get("_id");
    const name = formData.get("name");
    const location = formData.get("location");
    const floorsCount = formData.get("floorsCount");
    const sqFt = formData.get("sqFt");
    const isNewImage = formData.get("isNewImage") === "true" ? true : false;
    const newBuildingImage = formData.get("newBuildingImage");

    if (!name) throw new Error("Building name is required");
    if (isNewImage && !newBuildingImage)
      throw new Error("New Building image is required");

    if (!mongoose.Types.ObjectId.isValid(_id))
      throw new Error("Invalid Building ID");
    const building = await Building.findById(_id);
    if (!building) throw new Error("Invalid Building ID");

    const token = cookies()?.get("token")?.value;
    if (!token)
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    let jwtData;
    try {
      jwtData = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (error) {
      console.log(error);
      cookies().delete("token");
      return NextResponse.json({ msg: "Unauthorized", error }, { status: 401 });
    }
    const manager = await User.findById(jwtData?.id);
    if (!manager || manager.role !== "manager") {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    //Upload New Image
    let imageLink = building.buildingImage;
    if (isNewImage) {
      const dataForImageUrl = new FormData();
      dataForImageUrl.append("file", newBuildingImage);
      dataForImageUrl.append("path", `/building/${_id}`);
      dataForImageUrl.append("size", "5");
      dataForImageUrl.append("fileType", "jpg,png,jpeg,webp");
      dataForImageUrl.append("securityCode", process.env.TOKEN_SECRET);
      try {
        const { data } = await axios.post(
          `${process.env.BASE_URL}/api/singleFileUpload`,
          dataForImageUrl
        );
        if (!data.success) throw new Error(data.msg);
        imageLink = data.path;

        // Delete the building old image
        const buildingImagePath = building.buildingImage;
        const pathParts = buildingImagePath.split("/");
        const filePath = path.join(process.cwd(), "public", ...pathParts);
        // Remove the folder if it exists
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`Error deleting folder: ${filePath}`, err);
          } else {
            console.log(`Successfully deleted folder: ${filePath}`);
          }
        });
      } catch (error) {
        throw new Error(error);
      }
    }

    await Building.findByIdAndUpdate(_id, {
      name,
      location,
      floorsCount,
      sqFt,
      buildingImage: imageLink,
    });

    return NextResponse.json({
      success: true,
      msg: `${name} - Building Updated`,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, error, msg: error.message },
      { status: 500 }
    );
  }
};

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const buildingId = searchParams.get("buildingId");
    if (!buildingId) throw new Error("Missing Data");

    if (!mongoose.Types.ObjectId.isValid(buildingId))
      throw new Error("Invalid Building ID");

    const building = await Building.findById(buildingId);

    return NextResponse.json({
      success: true,
      msg: `"${building.name}" - Building Fetched`,
      building,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, error, msg: error.message },
      { status: 500 }
    );
  }
};

export const DELETE = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const buildingId = searchParams.get("buildingId");
    if (!buildingId) throw new Error("Missing Data");

    if (!mongoose.Types.ObjectId.isValid(buildingId))
      throw new Error("Invalid Building ID");

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

    const room = await Room.findOne({ building: buildingId });
    if (room) throw new Error("Building has Rooms, first delete those!");

    const targetBuilding = await Building.findById(buildingId);

    // Delete the building folder
    const buildingImagePath = targetBuilding.buildingImage;
    const pathParts = buildingImagePath.split("/");
    pathParts.pop();
    const folderPath = path.join(process.cwd(), "public", ...pathParts);
    // Remove the folder if it exists
    fs.rmdir(folderPath, { recursive: true }, (err) => {
      if (err) {
        console.error(`Error deleting folder: ${folderPath}`, err);
      } else {
        console.log(`Successfully deleted folder: ${folderPath}`);
      }
    });

    await Building.findByIdAndDelete(buildingId);

    return NextResponse.json({
      success: true,
      msg: `"${targetBuilding.name}" - Building Deleted`,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, error, msg: error.message },
      { status: 500 }
    );
  }
};
