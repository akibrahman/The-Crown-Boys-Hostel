import { NextResponse } from "next/server";

export async function middleware(req) {
  const path = req.nextUrl.pathname;
  const token = req.cookies.get("token")?.value || "";
  //! Manage Dashboard SSR --Start--
  if (path === "/dashboard" && !token) {
    const url = new URL("/signin", req.nextUrl);
    console.log("=================================");
    console.log("=================================", url);
    console.log("=================================", req.nextUrl);
    console.log("=================================", req.nextUrl.href);
    url.searchParams.set(
      "callbackUrl",
      `${req.nextUrl.pathname}${req.nextUrl.search}`
    );
    console.log("=================================", url);
    console.log("=================================");
    return NextResponse.redirect(url);
  }
  //! Manage Dashboard SSR --End--
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
    "/dashboard",
    "/profile",
    "/login",
    "/signup",
    "/order",
    "/orderStatus",
    "/sms",
  ],
};
