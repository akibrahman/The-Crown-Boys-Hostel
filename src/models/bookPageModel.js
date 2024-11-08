import mongoose from "mongoose";

const bookPageSchema = new mongoose.Schema({
  bookId: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
    unique: true,
  },
  textArea: {
    type: String,
    default: "",
  },
});

delete mongoose.models.bookPages;
const BookPage = mongoose.model("bookPages", bookPageSchema);

export default BookPage;
