import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const managerRoutes = [
  "/dashboard/add_room",
  "/dashboard/bills",
  "/dashboard/bookings",
  "/dashboard/books",
  "/dashboard/Clients",
  "/dashboard/count_charge",
  "/dashboard/Invoice",
  "/dashboard/market_details",
  "/dashboard/market_query",
  "/dashboard/meal_change_requests",
  "/dashboard/meal_query",
  "/dashboard/meal_sync",
  "/dashboard/order_status",
  "/dashboard/rfid",
  "/dashboard/rooms",
  "/dashboard/send_notification",
  "/dashboard/send_sms",
  "/dashboard/set_charge",
  "/dashboard/transactions",
];

const userRoutes = [
  "/dashboard/current_month",
  "/dashboard/manager_details",
  "/dashboard/meal_history",
  "/dashboard/my_bills",
];

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const { search } = req.nextUrl;
  const token = req.cookies.get("token")?.value || "";
  if (!token && (pathname == "/signin" || pathname == "/signup")) {
    return NextResponse.next();
  }
  if (!token) {
    const url = new URL("/signin", req.nextUrl);
    url.searchParams.set("callbackUrl", `${pathname}${search}`);
    return NextResponse.redirect(url);
  }
  if (token && (pathname == "/signin" || pathname == "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  let jwtData;
  try {
    jwtData = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.TOKEN_SECRET)
    );
  } catch (error) {
    cookies().delete("token");
    return NextResponse.redirect(new URL("/", req.url));
  }
  const role = jwtData.payload.role;
  if (managerRoutes.includes(pathname)) {
    if (role != "manager") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }
  if (userRoutes.includes(pathname)) {
    if (role !== "client") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/signin", "/signup"],
};
