import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import CountCharge from "@/models/countChargeModel";

const { dbConfig } = require("@/dbConfig/dbConfig");

await dbConfig();

// Manager Set Count Charge
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
    const { clients, charges } = await req.json();
    if (
      !Array.isArray(clients) ||
      clients.length == 0 ||
      !Array.isArray(charges) ||
      charges.length == 0
    ) {
      throw new Error(
        "Either Clients is not Array or Empty or Charges is not Array or Empty"
      );
    }
    await Promise.all(
      clients.map(async (client) => {
        charges.map(async (charge) => {
          await new CountCharge({
            userId: client.value,
            note: charge.note,
            amount: charge.amount,
            count: charge.count,
          }).save();
        });
      })
    );
    return NextResponse.json({ success: true, msg: "Charges Applied" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, msg: error?.message || "Server error!" },
      { status: 500 }
    );
  }
};

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const managerId = searchParams.get("managerId");
    if (!managerId) {
      throw new Error("managerId is required");
    }
    const charges = await CountCharge.aggregate([
      {
        $addFields: {
          userIdObj: { $toObjectId: "$userId" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userIdObj",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $match: {
          "user.manager": managerId,
        },
      },
      {
        $project: {
          _id: 1,
          note: 1,
          amount: 1,
          count: 1,
          "user.name": "$user.username",
          "user.email": 1,
          "user.image": "$user.profilePicture",
        },
      },
    ]);
    return NextResponse.json({ charges, success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, msg: error.message },
      { status: 500 }
    );
  }
};

// export const DELETE = async (req) => {
//   try {
//     let jwtData;
//     const token = cookies()?.get("token")?.value;
//     if (!token) throw new Error("Unauthorized !! No Token");
//     try {
//       jwtData = jwt.verify(token, process.env.TOKEN_SECRET);
//     } catch (error) {
//       if (error.message == "invalid token" || "jwt malformed") {
//         cookies().delete("token");
//       }
//       return NextResponse.json(
//         { msg: "Unauthorized !!", error },
//         { status: 401 }
//       );
//     }
//     const managerId = jwtData.id;
//     await User.updateMany({ manager: managerId }, { charges: [] });
//     return NextResponse.json({ success: true, msg: "Charges Deleted" });
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json(
//       { success: false, msg: error?.message || "Server error!" },
//       { status: 500 }
//     );
//   }
// };
