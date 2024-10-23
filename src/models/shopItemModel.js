import mongoose from "mongoose";

const shopItemSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  regularPrice: {
    type: Number,
    default: 0,
  },
  discountedPrice: {
    type: Number,
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  size: {
    type: String,
    default: "",
  },
  ingredients: {
    type: [String],
    default: [],
  },
  quantity: {
    type: Number,
    default: 0,
  },
  flavor: {
    type: String,
    default: "",
  },
  color: {
    type: String,
    default: "",
  },
});

delete mongoose.models.shopitems;
const ShopItem = mongoose.model("shopitems", shopItemSchema);

export default ShopItem;
