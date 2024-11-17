import { NextResponse } from "next/server";

export async function middleware(req) {
  const path = req.nextUrl.pathname;
  const token = req.cookies.get("token")?.value || "";
  //! Manage Dashboard SSR --Start--
  if (path === "/dashboard" && !token) {
    const url = new URL("/signin", req.nextUrl);
    url.searchParams.set(
      "callbackUrl",
      `${req.nextUrl.pathname}${req.nextUrl.search}`
    );
    return NextResponse.redirect(url);
  }
  //! Manage Dashboard SSR --End--
  else if (path === "/order" && !token) {
    // return NextResponse.redirect("/");
    const url = new URL("/signin", req.nextUrl);
    url.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  } else if ((path === "/signup" || path === "/signin") && token) {
    // return NextResponse.redirect("/login");
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }
}

export const config = {
  matcher: ["/", "/dashboard", "/signin", "/signup", "/order"],
};
