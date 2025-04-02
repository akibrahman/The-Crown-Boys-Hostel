import { dbConfig } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { formDataToObject } from "@/utils/formDataToObject";
import { separateFilesAndModifyObject } from "@/utils/separateFilesAndModifyObject";
import path from "path";
import fs from "fs";
import axios from "axios";

await dbConfig();

export const GET = async (req) => {
  try {
    //! Request
    const { searchParams } = new URL(req.url);
    const _id = searchParams.get("_id");
    const name = searchParams.get("name");
    const email = searchParams.get("email");
    const contactNumber = searchParams.get("contactNumber");
    //! Query
    let query = {};
    if (_id) query = { ...query, _id };
    if (name) query = { ...query, username: { $regex: new RegExp(name, "i") } };
    if (email) query = { ...query, email };
    if (contactNumber)
      query = {
        ...query,
        contactNumber,
      };
    //! User
    const user = await User.findOne(query).select(
      "username email contactNumber fathersNumber mothersNumber bkashNumber profilePicture idPicture birthCertificatePicture nidFrontPicture nidBackPicture role institution nidAuth blockDate floor roomNumber studentId bloodGroup messAddress manager charges"
    );
    //! Authorization
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
    const client = await User.findById(jwtData?.id);
    if (
      !client ||
      (client.role != "manager" && client._id.toString() != user._id.toString())
    )
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    //! Response
    return NextResponse.json({
      success: true,
      msg: "User fetched successfully",
      user,
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
    //! Request
    const formData = await req.formData();
    const { searchParams } = new URL(req.url);
    const payload = formDataToObject(formData);
    const { modifiedObject = {}, filesArray = [] } =
      separateFilesAndModifyObject(payload);
    let updateduser = { ...modifiedObject };
    let filesToBeUploaded = [...filesArray];
    const _id = searchParams.get("_id");
    if (!_id) throw new Error("_id is Required!");
    //! User
    const user = await User.findById(_id);
    if (!user) throw new Error("_id is Invalid!");
    //! Authorization
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
    const client = await User.findById(jwtData?.id);
    if (
      !client ||
      (client.role != "manager" && client._id.toString() != user._id.toString())
    )
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });

    if (
      client.role != "manager" &&
      client._id.toString() == user._id.toString()
    ) {
      filesToBeUploaded.forEach((f) => {
        if (
          (f.name == "idPicture" && user.idPicture) ||
          (f.name == "birthCertificatePicture" &&
            user.birthCertificatePicture) ||
          (f.name == "nidFrontPicture" && user.nidFrontPicture) ||
          (f.name == "nidBackPicture" && user.nidBackPicture)
        ) {
          throw new Error("UnAuthorized Change!");
        }
      });
    }
    //! Uploading Assets
    for (let i = 1; i <= filesToBeUploaded.length; i++) {
      const data = filesToBeUploaded[i - 1];
      const dataForImageUrl = new FormData();
      dataForImageUrl.append("file", data.file);
      dataForImageUrl.append("path", `/users`);
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
        updateduser = { ...updateduser, [data.name]: uploadResponse.path };
        //! Unlink
        const imagePath = path.join(
          process.cwd(),
          "public",
          ...user[data?.name]?.toString()?.split("/")
        );
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error(`Error deleting folder: ${imagePath}`, err);
          } else {
            console.log(`Successfully deleted folder: ${imagePath}`);
          }
        });
      } catch (error) {
        throw new Error(error?.response?.data?.msg || error.message);
      }
    }

    await user.updateOne(updateduser);
    //! Response
    return NextResponse.json({
      success: true,
      msg: "User Updated successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, msg: error.message },
      { status: 500 }
    );
  }
};
