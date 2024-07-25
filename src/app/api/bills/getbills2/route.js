import { dbConfig } from "@/dbConfig/dbConfig";
import Bill from "@/models/billModel";
import { NextResponse } from "next/server";

await dbConfig();

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const month = searchParams.get("month");
    const year = searchParams.get("year");
    const name = searchParams.get("name");

    let pipeline = [
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
    ];
    if (userId) pipeline.push({ $match: { userId } });
    if (month)
      pipeline.push({
        $match: { month: month.charAt(0).toUpperCase() + month.slice(1) },
      });
    if (year) pipeline.push({ $match: { year: parseInt(year) } });
    if (name)
      pipeline.push({
        $match: { "user.username": { $regex: name, $options: "i" } },
      });

    const bills = await Bill.aggregate(pipeline);
    return NextResponse.json({ bills, success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
};
