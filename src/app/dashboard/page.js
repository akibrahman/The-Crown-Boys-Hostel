import User from "@/models/userModel";
import { decode, verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

  return (
    <div>
      <p>Name: {user.username}</p>
      <p>E-mail: {user.email}</p>
      <p>Number: {user.contactNumber}</p>
      <p>Role: {user.role}</p>
    </div>
  );
};

export default page;
