// import User from "@/src/models/userModel";
import { NextResponse } from "next/server";
// import bcryptjs from 'bcryptjs';

import { dbConfig } from "@/dbConfig/dbConfig";

dbConfig();

export async function POST(req) {
  try {
    console.log("=>>>>", await req.json());
    return NextResponse.json(
      {
        msg: "Success From Next Backend",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("--------------->", error);
  }
}
