import { dbConfig } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import axios from "axios";
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";

await dbConfig();

export async function POST(req) {
  try {
    const formData = await req.formData();
    //! Extract All Data
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");
    const studentId = formData.get("studentId");
    const bloodGroup = formData.get("bloodGroup");
    const contactNumber = formData.get("contactNumber");
    const fathersNumber = formData.get("fathersNumber");
    const mothersNumber = formData.get("mothersNumber");
    const bkashNumber = formData.get("bkashNumber");
    const institution = formData.get("institution");
    const profilePicture = formData.get("profilePicture");
    const managerId = formData.get("manager");
    const role = formData.get("role");
    const isNid = formData.get("isNid");
    const birthCertificatePicture = formData.get("birthCertificatePicture");
    const nidFrontPicture = formData.get("nidFrontPicture");
    const nidBackPicture = formData.get("nidBackPicture");
    const idPicture = formData.get("idPicture");
    //! Validate All Data
    if (!username) throw new Error("UserName is Required!");
    if (!email) throw new Error("Email is Required!");
    if (!password) throw new Error("Password is Required!");
    if (!studentId) throw new Error("Student ID is Required!");
    if (!bloodGroup) throw new Error("Blood Group is Required!");
    if (!contactNumber) throw new Error("Contact Number is Required!");
    if (!bkashNumber) throw new Error("bKash Number is Required!");
    if (!institution) throw new Error("Institution is Required!");
    if (!profilePicture) throw new Error("Profile Picture is Required!");
    if (!managerId) throw new Error("Manager is Required!");
    if (!role) throw new Error("Role is Required!");
    if (!idPicture) throw new Error("ID Picture is Required!");
    if (isNid == "true") {
      if (!nidFrontPicture || !nidBackPicture)
        throw new Error("NID is Required!");
    } else if (isNid == "false" && !birthCertificatePicture)
      throw new Error("Birth Certificate is Required!");
    //! Check User
    const isExist = await User.findOne({ email, username });
    if (isExist) throw new Error("Email or Name is already in use!");
    //! Hashing
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    //! Checking Manager
    const manager = await User.findById(managerId);
    if (!manager || manager.role != "manager")
      throw new Error("Invalid Manager ID!");
    //! Uploading Assets
    let filesToBeUploaded = [
      { title: "profilePicture", file: profilePicture, url: "" },
      { title: "idPicture", file: idPicture, url: "" },
    ];
    if (nidFrontPicture)
      filesToBeUploaded.push({
        title: "nidFrontPicture",
        file: nidFrontPicture,
        url: "",
      });
    if (nidBackPicture)
      filesToBeUploaded.push({
        title: "nidBackPicture",
        file: nidBackPicture,
        url: "",
      });
    if (birthCertificatePicture)
      filesToBeUploaded.push({
        title: "birthCertificatePicture",
        file: birthCertificatePicture,
        url: "",
      });
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
      } catch (error) {
        throw new Error(error?.response?.data?.msg || error.message);
      }
    }
    //! Creating User
    await new User({
      username,
      email,
      password: hashedPassword,
      messAddress: manager.messAddress,
      studentId,
      bloodGroup,
      contactNumber,
      fathersNumber,
      mothersNumber,
      bkashNumber,
      institution,
      profilePicture,
      roomNumber: "",
      floor: 0,
      manager: managerId ? managerId : "",
      role,
      isManager: role === "manager" ? true : false,
      isClient: role === "client" ? true : false,
      nidAuth: isNid == "true" ? true : false,
      profilePicture:
        filesToBeUploaded?.find((f) => f?.title == "profilePicture")?.url || "",
      nidFrontPicture:
        filesToBeUploaded?.find((f) => f?.title == "nidFrontPicture")?.url ||
        "",
      nidBackPicture:
        filesToBeUploaded?.find((f) => f?.title == "nidBackPicture")?.url || "",
      idPicture:
        filesToBeUploaded?.find((f) => f?.title == "idPicture")?.url || "",
      birthCertificatePicture:
        filesToBeUploaded?.find((f) => f?.title == "birthCertificatePicture")
          ?.url || "",
    }).save();
    //! Response
    return NextResponse.json(
      {
        msg: "Successfully User Craeted",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { msg: error.message, success: false },
      { status: 500 }
    );
  }
}
