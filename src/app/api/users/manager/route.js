import { dbConfig } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse } from "next/server";

dbConfig();

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const managerId = searchParams.get("managerId");
    if (managerId) {
      const manager = await User.findById(managerId);
      if (manager) {
        return NextResponse.json({
          msg: "Manager found",
          success: true,
          manager,
        });
      }
    }
  } catch (error) {
    console.log("Error in backend when finding the manager");
    console.log(error);
    return NextResponse.json(
      {
        msg: "Manager found error",
        success: false,
        manager: null,
      },
      { status: 500 }
    );
  }
};

// url: URL {
//     href: 'http://localhost:3000/api/users/manager?managerId=65d4c9276391059a51023cc0',
//     origin: 'http://localhost:3000',
//     protocol: 'http:',
//     username: '',
//     password: '',
//     host: 'localhost:3000',
//     hostname: 'localhost',
//     port: '3000',
//     pathname: '/api/users/manager',
//     search: '?managerId=65d4c9276391059a51023cc0',
//     searchParams: URLSearchParams { 'managerId' => '65d4c9276391059a51023cc0' },
//     hash: ''
//   }
// },
