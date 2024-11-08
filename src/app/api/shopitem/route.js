import ShopItem from "@/models/shopItemModel";
import ShopOrder from "@/models/shopOrderModel";
import { sendSMS } from "@/utils/sendSMS";
import { NextResponse } from "next/server";
const { dbConfig } = require("@/dbConfig/dbConfig");

await dbConfig();

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const searchFilter =
      search && search.trim()
        ? {
            $or: [
              { name: { $regex: search, $options: "i" } },
              { description: { $regex: search, $options: "i" } },
            ],
          }
        : {};
    const items = await ShopItem.find(searchFilter);
    return NextResponse.json({
      success: true,
      items,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
};

export const POST = async (req) => {
  try {
    const { cart, customer, time } = await req.json();
    for (let j = 0; j < cart.length; j++) {
      await ShopItem.findByIdAndUpdate(cart[j]._id, {
        $inc: { quantity: -cart[j].qty },
      });
    }
    await sendSMS("01709605097", `Order From - ${customer.name}`);
    await new ShopOrder({
      cart,
      customerName: customer.name,
      customerNumber: customer.number,
      customerFloor: customer.floor,
      customerRoom: customer.room,
      orderCreatedAt: time,
      price: cart.reduce((a, c) => a + c.discountedPrice * c.qty, 0),
    }).save();
    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
};
