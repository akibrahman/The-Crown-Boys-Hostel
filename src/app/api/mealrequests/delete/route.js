import { dbConfig } from "@/dbConfig/dbConfig";
import MealRequest from "@/models/mealRequestModel";
import { NextResponse } from "next/server";

await dbConfig();

export const POST = async (req) => {
  try {
    const { reqId } = await req.json();
    await MealRequest.findByIdAndDelete(reqId);
    return NextResponse.json({
      msg: "Deletion successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: error.message, success: false });
  }
};
