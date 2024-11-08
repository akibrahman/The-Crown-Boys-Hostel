import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  managerId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  subTitle: {
    type: String,
    default: "",
  },
  color: {
    type: String,
    default: "blue",
  },
});

delete mongoose.models.books;
const Book = mongoose.model("books", bookSchema);

export default Book;
