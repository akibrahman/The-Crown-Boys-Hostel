import User from "@/models/userModel";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const { dbConfig } = require("@/dbConfig/dbConfig");

await dbConfig();

export const PUT = async (req) => {
  try {
    const { chargeData, _id } = await req.json();
    const user = await User.findById(_id);
    user.charges = [...user.charges, chargeData];
    await user.save();
    return NextResponse.json({
      success: true,
      msg: "Charge added to the user",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, msg: "Server error!" },
      { status: 500 }
    );
  }
};

export const PATCH = async (req) => {
  try {
    const { note, _id } = await req.json();
    const user = await User.findById(_id);
    user.charges = user.charges.filter((crg) => crg.note != note);
    await user.save();
    return NextResponse.json({ success: true, msg: "Charge deleted" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, msg: "Server error!" },
      { status: 500 }
    );
  }
};

// Manager Set Charge

export const POST = async (req) => {
  try {
    let jwtData;
    const token = cookies()?.get("token")?.value;
    if (!token) throw new Error("Unauthorized !! No Token");
    try {
      jwtData = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (error) {
      if (error.message == "invalid token" || "jwt malformed") {
        cookies().delete("token");
      }
      return NextResponse.json(
        { msg: "Unauthorized !!", error },
        { status: 401 }
      );
    }
    const managerId = jwtData.id;
    const { clients, chargeData } = await req.json();
    if (
      !Array.isArray(clients) ||
      clients.length == 0 ||
      !(
        typeof chargeData === "object" &&
        chargeData !== null &&
        Object.keys(chargeData).length > 0
      )
    ) {
      throw new Error(
        "Either Clients is not Array or Empty or chargeData is not Object or Empty"
      );
    }
    await Promise.all(
      clients.map(async (client) => {
        const user = await User.findById(client.value);
        const usersCharges = user.charges;
        Object.entries(chargeData).forEach(([key, value]) => {
          const newCharge = { note: key, amount: value };
          const isExists = usersCharges.find(
            (uc) =>
              uc.note.trim().toLowerCase() == key.trim().toLowerCase() &&
              uc.amount == value
          );
          if (!isExists) user.charges = [...user.charges, newCharge];
        });
        await user.save();
      })
    );
    return NextResponse.json({ success: true, msg: "Charge Applied" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, msg: error?.message || "Server error!" },
      { status: 500 }
    );
  }
};
