import { dbConfig } from "@/dbConfig/dbConfig";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/userModel";
import Book from "@/models/bookModel";
import mongoose from "mongoose";
import BookPage from "@/models/bookPageModel";

await dbConfig();

// export const GET = async (req) => {
//   try {
//     const { searchParams } = new URL(req.url);
//     const bookId = searchParams.get("bookId");
//     if (!bookId) throw new Error("Missing Data");
//     if (!mongoose.Types.ObjectId.isValid(bookId))
//       throw new Error("Invalid Book ID");

//     const token = cookies()?.get("token")?.value;
//     let jwtData;
//     try {
//       jwtData = jwt.verify(token, process.env.TOKEN_SECRET);
//     } catch (error) {
//       console.log(error);
//       if (error.message == "invalid token" || "jwt malformed") {
//         cookies().delete("token");
//       }
//       return NextResponse.json({ msg: "Unauthorized", error }, { status: 401 });
//     }

//     const manager = await User.findById(jwtData?.id);
//     if (!manager || manager.role != "manager")
//       return NextResponse.json({ msg: "Unauthorized", error }, { status: 401 });

//     const book = await Book.findOne({ managerId: jwtData.id, _id: bookId });
//     if (!book) throw new Error("Wrong Book ID");

//     const pages = await BookPage.find({ bookId });

//     return NextResponse.json({
//       success: true,
//       msg: `${book.title} - Book Fetched`,
//       book,
//       pages,
//     });
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json(
//       { success: false, error, msg: error.message },
//       { status: 500 }
//     );
//   }
// };

export const POST = async (req) => {
  try {
    const { date, bookId } = await req.json();
    if (!date || !bookId) throw new Error("Missing Data");

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

    await new BookPage({
      bookId,
      date,
    }).save();

    return NextResponse.json({ success: true, msg: `${date} - Page Created` });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, error, msg: error.message },
      { status: 500 }
    );
  }
};

export const PUT = async (req) => {
  try {
    const { textArea, pageId } = await req.json();
    if (!pageId) throw new Error("Missing Data");

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

    await BookPage.findByIdAndUpdate(pageId, { textArea: textArea || "" });

    return NextResponse.json({
      success: true,
      msg: `${pageId} - Page Updated`,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, error, msg: error.message },
      { status: 500 }
    );
  }
};

export const DELETE = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const pageId = searchParams.get("pageId");
    if (!pageId) throw new Error("Missing Data");

    if (!mongoose.Types.ObjectId.isValid(pageId))
      throw new Error("Invalid Page ID");

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

    await BookPage.findByIdAndDelete(pageId);

    return NextResponse.json({
      success: true,
      msg: `${pageId} - Page Deleted`,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, error, msg: error.message },
      { status: 500 }
    );
  }
};
