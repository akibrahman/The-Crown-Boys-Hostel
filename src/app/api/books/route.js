import { dbConfig } from "@/dbConfig/dbConfig";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/userModel";
import Book from "@/models/bookModel";
import BookPage from "@/models/bookPageModel";

await dbConfig();

export const GET = async (req) => {
  try {
    const token = cookies()?.get("token")?.value;
    let jwtData;
    try {
      jwtData = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (error) {
      console.log(error);
      if (error.message == "invalid token" || "jwt malformed") {
        cookies().delete("token");
      }
      return NextResponse.json({ msg: "Unauthorized", error }, { status: 401 });
    }

    const manager = await User.findById(jwtData?.id);
    if (!manager || manager.role != "manager")
      return NextResponse.json({ msg: "Unauthorized", error }, { status: 401 });

    const calculateTotalAmount = (textData) => {
      const lines = textData.trim().split("\n");
      const totalAmount = lines.reduce((sum, line) => {
        const match = line.match(/-?\d+(\.\d+)?$/);
        const amount = match ? parseFloat(match[0]) : 0;
        return sum + amount;
      }, 0);
      return totalAmount;
    };

    const allBooks = await Book.find({ managerId: jwtData.id });
    const books = await Promise.all(
      allBooks.map(async (book) => {
        const pages = await BookPage.find({ bookId: book._id });
        const totalAmount = pages.reduce(
          (sum, page) => sum + calculateTotalAmount(page.textArea),
          0
        );
        return { ...book.toObject(), totalAmount };
      })
    );

    return NextResponse.json({ success: true, books });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
};
