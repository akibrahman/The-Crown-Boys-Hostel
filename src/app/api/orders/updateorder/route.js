import Order from "@/models/orderModel";
import { NextResponse } from "next/server";

export const PATCH = async (req) => {
  try {
    const {
      meal,
      id,
      state,
      guestBreakfastCount,
      guestLunchCount,
      guestDinnerCount,
    } = await req.json();
    const order = await Order.findById(id);
    console.log(order);
    if (meal != "guest") {
      order[meal] = state;
      await order.save();
    } else {
      if (!state) {
        order.isGuestMeal = false;
        order.guestBreakfastCount = 0;
        order.guestLunchCount = 0;
        order.guestDinnerCount = 0;
      } else {
        order.isGuestMeal = state;
        order.guestBreakfastCount = guestBreakfastCount;
        order.guestLunchCount = guestLunchCount;
        order.guestDinnerCount = guestDinnerCount;
      }
      await order.save();
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
};
