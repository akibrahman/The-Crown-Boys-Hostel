import { dbConfig } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

await dbConfig();

export const POST = async (req) => {
  try {
    const { userId, path, link, type } = await req.json();
    const user = await User.findById(userId);
    const existingFiles = user?.files;
    const isExists = existingFiles.find((file) => file.path == path);
    if (isExists) return NextResponse.json({ msg: "Exists", success: true });
    const newFiles = [...existingFiles, { path, link, fileType: type }];
    user.files = newFiles;
    await user.save();
    return NextResponse.json({ msg: "OK", success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: "Backend Error", error }, { status: 500 });
  }
};
export const PUT = async (req) => {
  try {
    const { userId, path } = await req.json();
    const user = await User.findById(userId);
    const existingFiles = user?.files;
    const newFiles = existingFiles.filter((file) => file.path != path);
    user.files = newFiles;
    await user.save();
    return NextResponse.json({ msg: "OK", success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: "Backend Error", error }, { status: 500 });
  }
};
