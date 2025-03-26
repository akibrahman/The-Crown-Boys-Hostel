import { dbConfig } from "@/dbConfig/dbConfig";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/userModel";
import Building from "@/models/buildingModel";
import axios from "axios";

await dbConfig();

export const POST = async (req) => {
  try {
    const formData = await req.formData(); // Get form data
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
