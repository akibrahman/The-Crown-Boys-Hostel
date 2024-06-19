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
  const plainUser={
    _id:user._id,
    username:user.username,
    email:user.email,
    contactNumber:user.contactNumber,
    fathersNumber:user.fathersNumber,
    mothersNumber:user.mothersNumber,
    profilePicture:user.profilePicture,
    role:user.role,
    password:user.password,
    isVerified:user.isVerified,
    isManager:user.isManager,
    isClient:user.isClient,
    isManagerVerified:user.isManagerVerified,
    isClientVerified:user.isClientVerified,
    floor:user.floor,
    roomNumber:user.roomNumber,
    studentId:user.studentId,
    bloodGroup:user.bloodGroup,
    institute:user.institute,
    messAddress:user.messAddress,
    manager:user.manager,
    nidFrontPicture:user.nidFrontPicture,
    nidBackPicture:user.nidBackPicture,
    charges:user.charges,
    blockDate:user.blockDate,
  }

  return <Dashboard user={plainUser}/>;
};

export default page;
