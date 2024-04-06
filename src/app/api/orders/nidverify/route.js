import { NextResponse } from "next/server";
import { createWorker } from "tesseract.js";

export const POST = async (req) => {
  try {
    const { imageData } = await req.json();
    // console.log(imageData);
    //!
    const worker = createWorker();

    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");

    // Perform OCR on the uploaded image
    const {
      data: { text },
    } = await worker.recognize(imageData);

    // Release the worker
    await worker.terminate();

    // Extract name and ID number from the OCR result
    const lines = text.split("\n");
    let name, idNumber;
    lines.forEach((line) => {
      if (line.includes("Name")) {
        name = line.split(":")[1].trim();
      }
      if (line.includes("ID")) {
        idNumber = line.split(":")[1].trim();
      }
    });

    // Check if both name and ID number were extracted
    console.log("===>>>", name, idNumber);
    //!
    return NextResponse.json({ msg: "OK", success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: "Backend Error", error }, { status: 500 });
  }
};
