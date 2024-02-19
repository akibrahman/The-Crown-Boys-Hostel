import { NextResponse } from "next/server";

export const GET = async () => {
  const api = process.env.IMGBB_API;
  return NextResponse.json({ api }, { status: 200 });
};
