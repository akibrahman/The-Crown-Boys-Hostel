"use client";

import { AuthContext } from "@/providers/ContextProvider";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import toast from "react-hot-toast";

const Logout = () => {
  const { user, userRefetch } = useContext(AuthContext);
  const route = useRouter();

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/users/logout");
      if (data.success) {
        toast.success(data.msg);
        await userRefetch();
        console.log("1111111111111111111");
        route.push("/login");
      }
    } catch (error) {
      toast.error("Something went Wrong !");
      console.log(error);
    }
  };
  if (!user) return <p>Loading.......</p>;
  return (
    <div>
      <div className=" flex items-center flex-row-reverse justify-between">
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-stone-900 font-bold px-4 py-1 rounded-lg duration-300 active:scale-90"
        >
          Logout
        </button>
        <p>My Profile</p>
      </div>
      <div className="mt-10">
        <p>User Name: {user.username}</p>
        <p>E-mail: {user.email}</p>
        <p>Role: {user.role}</p>
      </div>
    </div>
  );
};

export default Logout;
