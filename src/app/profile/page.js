"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Logout = () => {
  const route = useRouter();

  const { data: user } = useQuery({
    queryKey: ["profile", "user"],
    queryFn: async () => {
      try {
        const { data } = await axios.get("/api/users/me");
        return data.user;
      } catch (error) {
        route.push("/login");
        return null;
      }
    },
  });

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/users/logout");
      if (data.success) {
        toast.success(data.msg);
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
