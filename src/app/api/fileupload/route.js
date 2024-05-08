import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import { join } from "path";

export const POST = async (req) => {
  const data = await req.formData();
  const file = data.get("file");
  if (!file) return NextResponse.json({ success: false });
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const path = join("/", "tmp", file.name);
  await writeFile(path, buffer);
  console.log(`Open ${path} to see the uploaded file.`);
  return NextResponse.json({ success: true });
};
