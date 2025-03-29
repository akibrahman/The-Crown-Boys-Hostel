import User from "@/models/userModel";
import { sendSMS } from "@/utils/sendSMS";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import path from "path";
import fs from "fs";

export const POST = async (req) => {
  try {
    const { id } = await req.json();
    if (!id) throw new Error("Invalid ID!");

    const user = await User.findById(id);
    if (!user) throw new Error("Invalid ID!");

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
    if (!manager || manager.role != "manager" || user.manager !== jwtData?.id)
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });

    await sendSMS(
      user.contactNumber,
      `Hi ${user.username},\nYour registration has been declined from the Authority, Please contact with us for more Details\n\nThe Corwn Boys Hostel Authority Team`
    );
    await User.findByIdAndDelete(id);
    //! Assets Delete
    let pathsToBeUnlinked = [
      user?.profilePicture,
      user?.idPicture,
      user?.birthCertificatePicture,
      user?.nidFrontPicture,
      user?.nidBackPicture,
    ];
    pathsToBeUnlinked.forEach((p) => {
      const imagePath = path.join(process.cwd(), "public", p);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error(`Error deleting folder: ${imagePath}`, err);
        } else {
          console.log(`Successfully deleted folder: ${imagePath}`);
        }
      });
    });

    return NextResponse.json({
      msg: "Deleted",
      success: true,
      email: user.email,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { msg: "Backend Problem", success: false },
      { status: 500 }
    );
  }
};
