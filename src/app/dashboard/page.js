"use client";
import Dashboard from "../../Components/Dashboard/Dashboard.jsx";
import { useContext } from "react";
import { AuthContext } from "@/providers/ContextProvider.jsx";

const Page = () => {
  // const token = cookies().get("token");

  // try {
  //   verify(token.value, process.env.TOKEN_SECRET);
  // } catch (err) {
  //   console.log(err);
  //   const baseUrl = process.env.BASE_URL;
  //   const url = new URL("/signin", baseUrl);
  //   url.searchParams.set("callbackUrl", baseUrl + "/dashboard");
  //   return redirect(url);
  // }

  // const { id } = decode(token.value);

  // const user = await User.findById(id);
  // console.log(user);
  const { user } = useContext(AuthContext);
  if (!user) return;
  return <Dashboard user={user} />;
};

export default Page;
