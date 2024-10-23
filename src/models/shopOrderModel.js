import mongoose from "mongoose";

const shopOrderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    default: "",
  },
  customerNumber: {
    type: String,
    default: "",
  },
  customerFloor: {
    type: String,
    default: "",
  },
  customerRoom: {
    type: String,
    default: "",
  },
  cart: {
    type: [{}],
    default: [],
  },
  price: {
    type: Number,
    default: 0,
  },
  orderCreatedAt: {
    type: String,
    default: "",
  },
});

delete mongoose.models.shoporders;
const ShopOrder = mongoose.model("shoporders", shopOrderSchema);

export default ShopOrder;
