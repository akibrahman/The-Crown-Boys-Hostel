import { NextResponse } from "next/server";

export function middleware(req) {
  const path = req.nextUrl.pathname;
  const token = req.cookies.get("token")?.value || "";
  if ((path === "/profile" || path === "/order") && !token) {
    // return NextResponse.redirect("/");
    const url = new URL("/signin", req.nextUrl);
    url.searchParams.set("callbackUrl", req.nextUrl.href);
    return NextResponse.redirect(url);
  }
  if ((path === "/orderStatus" || path === "/sms") && !token) {
    // return NextResponse.redirect("/");
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }
  if ((path === "/signup" || path === "/login") && token) {
    // return NextResponse.redirect("/login");
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }
}

export const config = {
  matcher: [
    "/",
    "/profile",
    "/login",
    "/signup",
    "/order",
    "/orderStatus",
    "/sms",
  ],
};
