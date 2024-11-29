"use server";
const { dbConfig } = require("@/dbConfig/dbConfig");

await dbConfig();

import { NextResponse } from "next/server";
import { SerialPort, ReadlineParser } from "serialport";

let latestData = "No data yet";

const port = new SerialPort({
  path: "COM11", // Replace with your Arduino's port (e.g., "COM3" on Windows)
  baudRate: 9600,
});

const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

parser.on("data", (data) => {
  console.log("Received:", data);
  latestData = data; // Update latest data
});

export async function GET() {
  try {
    return NextResponse.json({ distance: latestData, success: true });
  } catch (error) {
    return NextResponse.json(
      { distance: latestData, success: false },
      { status: 500 }
    );
  }
}
