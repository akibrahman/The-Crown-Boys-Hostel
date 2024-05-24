import { NextResponse } from "next/server";

export const POST = async (req) => {
  const body = await req.json();
  if (body.object === "page") {
    return NextResponse.json("EVENT_RECEIVED", { status: 200 });
  } else {
    return NextResponse.json("EVENT_ERROR", { status: 404 });
  }
};

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");
  if (mode && token) {
    if (mode == "subscribe" && token == process.env.FACEBOOK_VERIFY_TOKEN) {
      console.log("WEBHOOK_VERIFIED");
      return NextResponse.json(parseInt(challenge), { status: 200 });
    } else {
      return NextResponse.json("ERROR", { status: 403 });
    }
  }
};
