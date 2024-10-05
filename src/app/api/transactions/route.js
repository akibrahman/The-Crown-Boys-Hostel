import { dbConfig } from "@/dbConfig/dbConfig";
import Transaction from "@/models/transactionModel";
import User from "@/models/userModel";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

await dbConfig();

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const forManager = searchParams.get("forManager");
    if (
      !forManager ||
      (forManager != true &&
        forManager != "true" &&
        forManager != false &&
        forManager != "false")
    )
      throw new Error("Unauthorized 1 !!");
    let manager = null;
    let user = null;
    let id = null;
    const token = cookies()?.get("token")?.value;
    if (!token) throw new Error("Unauthorized 2 !!");
    try {
      jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (error) {
      if (error.message == "invalid token" || "jwt malformed") {
        cookies().delete("token");
      }
      return NextResponse.json(
        { msg: "Unauthorized 3 !!", error },
        { status: 401 }
      );
    }
    if (forManager == true || forManager == "true") {
      const { id: tokenId } = jwt.decode(token);
      id = tokenId;
      if (!id || !mongoose.Types.ObjectId.isValid(id))
        throw new Error("Unauthorized !!");
      manager = await User.findById(id);
      if (!manager || manager.role != "manager")
        throw new Error("Unauthorized !!");
    } else if (forManager == false || forManager == "false") {
      const { id: tokenId } = jwt.decode(token);
      id = tokenId;
      if (!id || !mongoose.Types.ObjectId.isValid(id))
        throw new Error("Unauthorized !!");
      user = await User.findById(id);
      if (!user || user.role != "client") throw new Error("Unauthorized !!");
    }

    const transactions = await Transaction.aggregate([
      {
        $addFields: {
          userIdObj: { $toObjectId: "$userId" },
          createdAtDate: {
            $toDate: "$transactionDate",
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userIdObj",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $match: {
          "userDetails.manager": id,
        },
      },
      {
        $sort: { createdAtDate: -1 },
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          billId: 1,
          note: 1,
          reason: 1,
          coupon: 1,
          reference: 1,
          transactionId: 1,
          bKashTransactionId: 1,
          transactionDate: 1,
          method: 1,
          tax: 1,
          payments: 1,
          userDetails: {
            username: 1,
            email: 1,
            contactNumber: 1,
            profilePicture: 1,
          },
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      transactions,
      msg: "Transactions fetched successfully",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
};
