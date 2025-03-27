import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export const POST = async (req) => {
  try {
    const formData = await req.formData(); // Get form data
    const securityCode = formData.get("securityCode");
    const file = formData.get("file");
    const customName = formData.get("customName");
    const pathParam = formData.get("path")
      ? `uploads${formData.get("path")}`
      : "uploads"; // Default path: /public/uploads
    const maxSizeMB =
      formData.get("size") === "*"
        ? null
        : formData.get("size")
        ? parseFloat(formData.get("size"))
        : null;
    const allowedTypes =
      formData.get("fileType") === "*"
        ? []
        : formData.get("fileType")
        ? formData.get("fileType").split(",")
        : [];

    if (!securityCode) {
      return NextResponse.json(
        { success: false, msg: "Unauthorized" },
        { status: 401 }
      );
    }
    if (securityCode != process.env.TOKEN_SECRET) {
      return NextResponse.json(
        { success: false, msg: "Unauthorized 2" },
        { status: 401 }
      );
    }
    if (!file) {
      return NextResponse.json(
        { success: false, msg: "No file uploaded" },
        { status: 400 }
      );
    }

    const fileBuffer = await file.arrayBuffer();
    const fileExtension = path.extname(file.name).slice(1); // Get file extension
    const fileSizeMB = file.size / (1024 * 1024); // Convert bytes to MB

    // Validate file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(fileExtension)) {
      return NextResponse.json(
        { success: false, msg: "Invalid file type" },
        { status: 400 }
      );
    }

    // Validate file size
    if (maxSizeMB !== null && fileSizeMB > maxSizeMB) {
      return NextResponse.json(
        { success: false, msg: "File too large" },
        { status: 400 }
      );
    }

    // Determine upload path
    const uploadDir = path.join(process.cwd(), "public", pathParam);
    await fs.mkdir(uploadDir, { recursive: true });

    const fileName = customName || `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);

    // Save the file
    await fs.writeFile(filePath, Buffer.from(fileBuffer));

    return NextResponse.json({
      success: true,
      msg: "File uploaded successfully",
      path: `/${pathParam}/${fileName}`,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { success: false, msg: error.message },
      { status: 500 }
    );
  }
};
