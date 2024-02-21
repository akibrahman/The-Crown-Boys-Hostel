"use client";

import { AuthContext } from "@/providers/ContextProvider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { FaTimes } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { TiTick } from "react-icons/ti";

const Logout = () => {
  const { user, userRefetch } = useContext(AuthContext);
  const route = useRouter();
  const [givingAuthorization, setGivingAuthorization] = useState(false);

  const { data: managers, refetch: managersRefetch } = useQuery({
    queryKey: ["managers", "owner"],
    queryFn: async () => {
      const { data } = await axios.get("/api/managers/getmanagers");
      return data.managers;
    },
  });

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/users/logout");
      if (data.success) {
        toast.success(data.msg);
        await userRefetch();
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
      {/* <div className="flex items-start justify-start gap-10"> */}
      <div className="grid grid-cols-4 gap-4">
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

          {user.isVerified ? (
            <p className="flex items-center gap-1 bg-green-500 w-max px-4 py-1 rounded-full font-semibold mt-2">
              <TiTick className="text-xl" />
              Verified
            </p>
          ) : (
            <button
              onClick={async () => {
                axios.post("/api/sendverificationemail", {
                  email: user.email,
                  emailType: "verify",
                  userId: user._id,
                });
                toast.success("Verification E-mail sent");
              }}
              className="flex items-center gap-1 duration-300 bg-yellow-500 w-max px-4 py-1 rounded-full font-semibold mt-2 active:scale-90"
            >
              Verify Please
            </button>
          )}
        </div>
        {/* Managers  */}
        {user.role === "owner" && (
          <div className="col-span-2 h-[380px] border-l-4 border-blue-500 overflow-y-scroll px-3 flex flex-col items-center gap-4 mt-10 relative">
            <div className="sticky top-0">
              <input
                placeholder="Search by name"
                type="text"
                className="w-80 px-4 pl-12 py-3 rounded-full text-white bg-stone-900 focus:outline-none"
              />
              <IoSearchOutline className="absolute top-1/2 -translate-y-1/2 left-4 text-lg" />
            </div>

            {managers.map((manager) => (
              <div
                key={manager._id}
                className="border px-6 py-5 rounded-lg flex items-center w-[430px] justify-between gap-4"
              >
                <Image
                  alt={`Profile picture of ${manager.username} who is a manager`}
                  src={manager.profilePicture}
                  height={60}
                  width={60}
                  className="rounded-full aspect-square"
                />
                {/* <p>1</p> */}
                <div>
                  <p>{manager.username}</p>
                  <p className="text-sm">{manager.email}</p>
                </div>
                {manager.isVerified === true ? (
                  <>
                    {manager.isManagerVerified === true ? (
                      <p className="text-blue-500 font-semibold flex items-center gap-1">
                        <TiTick className="text-3xl font-normal" />
                        Approved
                      </p>
                    ) : (
                      <>
                        <button
                          onClick={async () => {
                            const confirmation = await confirm(
                              "Are you sure to Authorize?"
                            );
                            if (confirmation) {
                              setGivingAuthorization(true);
                              try {
                                const { data } = await axios.post(
                                  "api/managers/approvemanager",
                                  { id: manager._id }
                                );
                                if (data.success) {
                                  await managersRefetch();
                                  toast.success("Authorization Provided");
                                }
                              } catch (error) {
                                console.log(
                                  "Frontend problem when authorizing as a manager"
                                );
                                console.log(error);
                                toast.error("Authorization Error!");
                              } finally {
                                setGivingAuthorization(false);
                              }
                            } else {
                              toast.success("Cancelled!");
                            }
                          }}
                          className="bg-green-500 text-white font-semibold px-4 py-1 rounded-full duration-300 flex items-center gap-1 active:scale-90"
                        >
                          Approve
                          {givingAuthorization && (
                            <CgSpinner className="animate-spin text-2xl" />
                          )}
                        </button>
                        {/* <button className="bg-red-500 text-white font-semibold px-4 py-1 rounded-full duration-300 active:scale-90">
                        Reject
                      </button> */}
                      </>
                    )}
                  </>
                ) : (
                  <p className="text-red-500 font-semibold flex items-center gap-1">
                    <FaTimes className="text-xl font-normal" />
                    Unverified
                  </p>
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
