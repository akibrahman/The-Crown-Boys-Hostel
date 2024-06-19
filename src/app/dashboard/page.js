"use server";
import User from "@/models/userModel";
import { decode, verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Dashboard from "../../Components/Dashboard/Dashboard.jsx";

const page = async () => {
  const token = cookies().get("token");

  try {
    verify(token.value, process.env.TOKEN_SECRET);
  } catch (err) {
    console.log(err);
    const baseUrl = process.env.BASE_URL;
    const url = new URL("/signin", baseUrl);
    url.searchParams.set("callbackUrl", baseUrl + "/dashboard");
    return redirect(url);
  }

  const { id } = decode(token.value);

  const user = await User.findById(id);
  console.log(user);

  return <Dashboard user={user.toJSON()}/>;
};

export default page;
