import { NextResponse } from "next/server";

export function middleware(req) {
  const path = req.nextUrl.pathname;
  // const isPublicPath = path === "/login" || path === "/signup";
  const token = req.cookies.get("token")?.value || "";
  if (path === "/profile" && !token) {
    // return NextResponse.redirect("/");
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }
  if ((path === "/signup" || path === "/login") && token) {
    // return NextResponse.redirect("/login");
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }
}

export const config = {
  matcher: ["/", "/profile", "/login", "/signup"],
};
