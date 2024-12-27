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
        await Promise.all(
          charges.map(async (charge) => {
            await new CountCharge({
              userId: client.value,
              note: charge.note,
              amount: charge.amount,
              count: charge.count,
            }).save();
          })
        );
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
