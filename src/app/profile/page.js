"use client";

import { AuthContext } from "@/providers/ContextProvider";
import { convertCamelCaseToCapitalized } from "@/utils/camelToCapitalize";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { FaTimes } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { TiTick } from "react-icons/ti";

const Profile = () => {
  const { user, userRefetch, manager } = useContext(AuthContext);
  const route = useRouter();
  const [givingAuthorization, setGivingAuthorization] = useState(false);
  const [currentDays, setCurrentDays] = useState(null);

  //! For Client
  const [breakfastCount, setBreakfastCount] = useState(0);
  const [lunchCount, setLunchCount] = useState(0);
  const [dinnerCount, setDinnerCount] = useState(0);

  const { data: managers, refetch: managersRefetch } = useQuery({
    queryKey: ["managers", "owner"],
    queryFn: async () => {
      if (user?.role === "owner") {
        const { data } = await axios.get("/api/managers/getmanagers");
        return data.managers;
      }
    },
  });
  const { data: clients, refetch: clientRefetch } = useQuery({
    queryKey: ["clients", "manager", user?._id],
    queryFn: async ({ queryKey }) => {
      const { data } = await axios.get(
        `/api/clients/getclients?id=${queryKey[2]}`
      );
      return data.clients;
    },
  });

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/users/logout");
      if (data.success) {
        await userRefetch();
        route.push("/signin");
        toast.success(data.msg);
      }
    } catch (error) {
      toast.error("Something went Wrong !");
      console.log(error);
    }
  };

  //! Get current month
  useEffect(() => {
    if (user?.role === "client" || user?.role === "manager") {
      const currentDate = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Dhaka",
      });
      const currentMonth = new Date(currentDate).getMonth() + 1;
      const currentYear = new Date(currentDate).getFullYear();
      const dayCountOfCurrentMonth = parseInt(
        new Date(currentYear, currentMonth, 0).getDate()
      );

      let tempArray = [];
      for (let i = 1; i <= dayCountOfCurrentMonth; i++) {
        tempArray.push(i);
      }
      setCurrentDays(tempArray);
    }
  }, [user?.role]);

  const currentMonth = new Date().toLocaleDateString("en-BD", {
    month: "long",
    timeZone: "Asia/Dhaka",
  });
  const currentYear = new Date().toLocaleDateString("en-BD", {
    year: "numeric",
    timeZone: "Asia/Dhaka",
  });

  const { data: calanderData } = useQuery({
    queryKey: ["calanderData", "user", user?._id],
    queryFn: async ({ queryKey }) => {
      try {
        const { data } = await axios.post("/api/orders/getorders", {
          userId: queryKey[2],
          month: currentMonth,
          year: currentYear,
        });
        return data.orders;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    enabled: user?._id ? true : false,
  });

  //! Get Breakfast, Lunch and Dinner count
  useEffect(() => {
    if (calanderData) {
      const breakfast = calanderData.reduce(
        (accumulator, currentValue) =>
          accumulator + (currentValue.breakfast ? 1 : 0),
        0
      );
      setBreakfastCount(breakfast);
      const lunch = calanderData.reduce(
        (accumulator, currentValue) =>
          accumulator + (currentValue.lunch ? 1 : 0),
        0
      );
      setLunchCount(lunch);
      const dinner = calanderData.reduce(
        (accumulator, currentValue) =>
          accumulator + (currentValue.dinner ? 1 : 0),
        0
      );
      setDinnerCount(dinner);
    }
  }, [calanderData]);

  if (!user) return <p>Loading.......User</p>;
  if (user.role === "owner" && !managers) return <p>Loading.......</p>;
  if (user.role === "manager" && (!clients || !currentDays))
    return <p>Loading.......Clients</p>;

  if (user.role === "client" && (!manager || !currentDays || !calanderData))
    return <p>Loading.......Manager</p>;
  return (
    <div>
      <div className=" flex items-center flex-row-reverse justify-between">
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-stone-900 font-bold px-4 py-1 rounded-lg duration-300 active:scale-90"
        >
          Logout
        </button>
        {user.role === "client" && user.isVerified && user.isClientVerified && (
          <>
            <p className="text-lg border rounded-xl border-yellow-500 px-8 py-1.5">
              Dinner: {dinnerCount}
            </p>
            <p className="text-lg border rounded-xl border-yellow-500 px-8 py-1.5">
              Lunch: {lunchCount}
            </p>
            <p className="text-lg border rounded-xl border-yellow-500 px-8 py-1.5">
              Breakfast: {breakfastCount}
            </p>
          </>
        )}
        <p className="text-lg bg-yellow-500 rounded-xl font-semibold px-6 py-1.5">
          My Profile
        </p>
      </div>
      {/* Parent Block  */}
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
            className="mb-10 rounded-full aspect-square"
          />
          <p>User Name: {user.username}</p>
          <p>E-mail: {user.email}</p>
          <p>Role: {convertCamelCaseToCapitalized(user.role)}</p>

          {user.isVerified ? (
            <p
              className={`flex items-center gap-1 w-max px-4 py-1 rounded-full font-semibold mt-2 ${
                user.role === "owner" ? "bg-blue-500" : "bg-green-500"
              }`}
            >
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
        {/* Clalnder as a Client */}
        {user.role == "client" && user.isVerified && user.isClientVerified && (
          <div className="col-span-2 border-l-4 pl-6 pb-8 mt-10 border-purple-500">
            <p className="text-center text-xl font-semibold border border-yellow-500 rounded-xl px-4 py-2 relative">
              {currentMonth}
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-yellow-500">
                {breakfastCount * 30 + lunchCount * 60 + dinnerCount * 60 + 500}{" "}
                BDT
              </span>
            </p>
            <div className="mt-6 flex items-center justify-center flex-wrap gap-4">
              {calanderData.map((order) => (
                <div
                  key={order._id}
                  className="relative w-16 h-16 rounded-xl bg-yellow-500 flex items-center justify-center"
                >
                  {order.date.split("/")[1]}
                  <span
                    className={`absolute w-2 h-2 rounded-full left-2 bottom-1.5 ${
                      order.breakfast ? "bg-green-600" : "bg-red-600"
                    }`}
                  ></span>
                  <span
                    className={`absolute w-2 h-2 rounded-full left-1/2 -translate-x-1/2 bottom-1.5 ${
                      order.lunch ? "bg-green-600" : "bg-red-600"
                    }`}
                  ></span>
                  <span
                    className={`absolute w-2 h-2 rounded-full right-2 bottom-1.5 ${
                      order.dinner ? "bg-green-600" : "bg-red-600"
                    }`}
                  ></span>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Manager's Details  */}
        {user.role === "client" && !user.isVerified ? (
          <div className="flex items-center justify-center border-l-4 pl-6 py-8 border-purple-500 mt-10">
            <p>At first verify youself!</p>
          </div>
        ) : user.role === "client" &&
          user.isVerified &&
          !user.isClientVerified ? (
          <div className="flex items-center justify-center border-l-4 pl-6 py-8 border-purple-500 mt-10">
            <p>Wait till manager accepts you!</p>
          </div>
        ) : user.role === "client" &&
          user.isVerified &&
          user.isClientVerified ? (
          <div
            className={`mt-10 border-l-4 pl-6 py-8 ${
              manager.role === "owner" && "border-blue-500"
            } ${manager.role === "manager" && "border-purple-500"} ${
              manager.role === "client" && "border-yellow-500"
            }`}
          >
            <Image
              alt={`Profile picture of ${manager.username}`}
              src={manager.profilePicture}
              width={200}
              height={200}
              className="mb-10 rounded-full aspect-square"
            />
            <p>Manager&apos;s Name: {manager.username}</p>
            <p>E-mail: {manager.email}</p>
          </div>
        ) : (
          <></>
        )}
        {/* Managers, me as a Owner  */}
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
        {/* Clients, me as a manager  */}
        {user.role === "manager" &&
        user.isVerified &&
        user.isManagerVerified ? (
          <div className="col-span-2 h-[380px] border-l-4 border-blue-500 overflow-y-scroll px-3 flex flex-col items-center gap-4 mt-10 relative">
            <div className="sticky top-0">
              <input
                placeholder="Search by name"
                type="text"
                className="w-80 px-4 pl-12 py-3 rounded-full text-white bg-stone-900 focus:outline-none"
              />
              <IoSearchOutline className="absolute top-1/2 -translate-y-1/2 left-4 text-lg" />
            </div>

            {clients.map((client) => (
              <div
                key={client._id}
                className="border px-6 py-5 rounded-lg flex items-center w-[450px] justify-between gap-4"
              >
                <Image
                  alt={`Profile picture of ${client.username} who is a manager`}
                  src={client.profilePicture}
                  height={60}
                  width={60}
                  className="rounded-full aspect-square"
                />
                <div>
                  <p>{client.username}</p>
                  <p className="text-sm">{client.email}</p>
                </div>
                {client.isVerified === true ? (
                  <>
                    {client.isClientVerified === true ? (
                      <p className="text-blue-500 font-semibold flex items-center gap-1">
                        <TiTick className="text-3xl font-normal" />
                        Approved
                      </p>
                    ) : (
                      <>
                        <button
                          onClick={async () => {
                            const confirmation = confirm(
                              "Are you sure to make your client?"
                            );
                            if (confirmation) {
                              //! Here
                              setGivingAuthorization(true);
                              try {
                                await axios.post("/api/orders/makeorders", {
                                  userId: client._id,
                                  managerId: user._id,
                                  days: parseInt(
                                    currentDays[currentDays.length - 1]
                                  ),
                                  currentMonthName:
                                    new Date().toLocaleDateString("en-BD", {
                                      month: "long",
                                      timeZone: "Asia/Dhaka",
                                    }),
                                  currentMonth: new Date(
                                    new Date().toLocaleString("en-US", {
                                      timeZone: "Asia/Dhaka",
                                    })
                                  ).getMonth(),
                                  currentYear: new Date(
                                    new Date().toLocaleString("en-US", {
                                      timeZone: "Asia/Dhaka",
                                    })
                                  ).getFullYear(),
                                });

                                const { data } = await axios.post(
                                  "api/clients/approveclient",
                                  { id: client._id }
                                );
                                if (data.success) {
                                  await clientRefetch();
                                  toast.success("Authorization Provided");
                                }
                              } catch (error) {
                                console.log(
                                  "Frontend problem when authorizing as a client"
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
        ) : user.role === "manager" && !user.isVerified ? (
          <div className="col-span-2 h-[380px] border-l-4 border-blue-500 overflow-y-scroll px-3 flex items-center justify-center gap-4 mt-10 relative">
            <p>Verify Email</p>
          </div>
        ) : user.role === "manager" && !user.isManagerVerified ? (
          <div className="col-span-2 h-[380px] border-l-4 border-blue-500 overflow-y-scroll px-3 flex items-center justify-center gap-4 mt-10 relative">
            <p>Verify as a manager</p>
          </div>
        ) : (
          <></>
        )}
        {/* Settings Part & me as a manager  */}
        {user.role === "manager" &&
        user.isVerified &&
        user.isManagerVerified ? (
          <div className="h-[380px] border-l-4 border-blue-500 overflow-y-scroll px-3 mt-10 relative">
            <div className="flex items-start justify-center flex-wrap gap-5">
              <Link href="/orderStatus" className="w-full">
                <button class="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 w-full active:scale-90">
                  Order Status
                </button>
              </Link>
              <Link href="/userQuery">
                <button className="bg-yellow-500 text-white px-4 py-2 rounded-full font-semibold duration-300 active:scale-90">
                  User Query
                </button>
              </Link>
              <button className="bg-yellow-500 text-white px-4 py-2 rounded-full font-semibold duration-300 active:scale-90">
                Meal Updator
              </button>
            </div>
          </div>
        ) : user.role === "manager" && !user.isVerified ? (
          <div className="h-[380px] border-l-4 border-blue-500 overflow-y-scroll px-3 flex items-center justify-center gap-4 mt-10 relative">
            <p>Verify Email</p>
          </div>
        ) : user.role === "manager" && !user.isManagerVerified ? (
          <div className="col-span-2 h-[380px] border-l-4 border-blue-500 overflow-y-scroll px-3 flex items-center justify-center gap-4 mt-10 relative">
            <p>Verify as a manager</p>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Profile;
