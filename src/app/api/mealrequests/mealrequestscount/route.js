import MealRequest from "@/models/mealRequestModel";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    const query = { isResponded: false };
    const count = await MealRequest.find(query).countDocuments();
    return NextResponse.json({ msg: "OK", success: true, count });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, msg: "Backend Error", error },
      { status: 500 }
    );
  }
};
