"use client";

import { AuthContext } from "@/providers/ContextProvider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import toast from "react-hot-toast";
import { IoSearchOutline } from "react-icons/io5";
import { TiTick } from "react-icons/ti";

const Logout = () => {
  const { user, userRefetch } = useContext(AuthContext);
  const route = useRouter();

  const { data: managers } = useQuery({
    queryKey: ["managers", "owner"],
    queryFn: async () => {
      const { data } = await axios.get("/api/managers");
      return data.managers;
    },
  });

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
  if (!user || !managers) return <p>Loading.......</p>;
  console.log(managers);
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
      {/* Parent Block  */}
      <div className="flex items-start justify-start gap-10">
        {/* Profile Details  */}
        <div
          className={`mt-10 border-l-4 pl-6 py-8 ${
            user.role === "owner" && "border-blue-500"
          } ${user.role === "manager" && "border-purple-500"} ${
            user.role === "client" && "border-yellow-500"
          }`}
        >
          <Image
            alt={`Profile picture of ${user.username}`}
            src={user.profilePicture}
            width={200}
            height={200}
            className="mb-10 rounded-full"
          />
          <p>User Name: {user.username}</p>
          <p>E-mail: {user.email}</p>
          <p>Role: {user.role}</p>
        </div>
        {/* Managers  */}
        {user.role === "owner" && (
          <div className="h-[380px] border-l-4 border-blue-500 overflow-y-scroll px-3 flex flex-col items-center gap-4 mt-10 relative">
            <div className="sticky top-0">
              <input
                type="text"
                className="w-80 px-4 pl-12 py-3 rounded-full text-white bg-stone-900 focus:outline-none"
              />
              <IoSearchOutline className="absolute top-1/2 -translate-y-1/2 left-4 text-lg" />
            </div>

            {managers.map((manager) => (
              <div
                key={manager._id}
                className="border px-6 py-5 rounded-lg flex items-center justify-center gap-4"
              >
                <Image
                  alt={`Profile picture of ${manager.username} who is a manager`}
                  src={manager.profilePicture}
                  height={60}
                  width={60}
                  className="rounded-full aspect-square"
                />
                <p>1</p>
                <div>
                  <p>{manager.username}</p>
                  <p>{manager.email}</p>
                </div>
                {manager.isManagerVerified === true ? (
                  <p className="text-blue-500 font-semibold flex items-center gap-1">
                    <TiTick className="text-3xl font-normal" />
                    Verified
                  </p>
                ) : (
                  <>
                    <button className="bg-green-500 text-white font-semibold px-4 py-1 rounded-full duration-300 active:scale-90">
                      Approve
                    </button>
                    <button className="bg-red-500 text-white font-semibold px-4 py-1 rounded-full duration-300 active:scale-90">
                      Reject
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Logout;
