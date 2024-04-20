"use client";

import PreLoader from "@/Components/PreLoader/PreLoader";
import { AuthContext } from "@/providers/ContextProvider";
import { convertCamelCaseToCapitalized } from "@/utils/camelToCapitalize";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BsChatSquareQuote } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";
import { FaArrowRight, FaTimes } from "react-icons/fa";
import { GiPayMoney } from "react-icons/gi";
import { IoSearchOutline } from "react-icons/io5";
import { TiTick } from "react-icons/ti";
import Modal from "react-modal";
import { Tooltip } from "react-tooltip";

const Profile = () => {
  const { user, userRefetch, manager } = useContext(AuthContext);
  const route = useRouter();
  const [givingAuthorization, setGivingAuthorization] = useState(false);
  const [canVerify, setCanVerify] = useState(true);
  const [declining, setDeclining] = useState(false);
  const [currentDays, setCurrentDays] = useState(null);

  const [breakfastCount, setBreakfastCount] = useState(0);
  const [lunchCount, setLunchCount] = useState(0);
  const [dinnerCount, setDinnerCount] = useState(0);
  const [clientDetailsModalIsOpen, setClientDetailsModalIsOpen] =
    useState(false);
  const [clientDetailsIsLoading, setClientDetailsIsLoading] = useState(false);
  const [clientDetails, setClientDetails] = useState(null);

  const [loggingOut, setLoggingOut] = useState(false);
  const [managerAmount, setManagerAmount] = useState(null);
  const [isMoneyAdding, setIsMoneyAdding] = useState(false);

  const customStylesForclientDetailsModal = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      padding: "0",
      // backgroundColor: "#000",
      // border: "1px solid #EAB308",
    },
    overlay: {
      backgroundColor: "rgba(0,0,0,0.5)",
    },
  };

  const openModalForClientDetails = () => {
    setClientDetailsModalIsOpen(true);
  };

  const closeModalForClientDetails = () => {
    setClientDetailsModalIsOpen(false);
  };

  const getDetailsOfClientForApproval = async (id) => {
    setClientDetailsIsLoading(true);
    setClientDetails(null);
    try {
      const { data } = await axios.get(`/api/clients/getclient?id=${id}`);
      if (data.success) {
        console.log(data.client);
        setClientDetails(data.client);
        openModalForClientDetails();
      }
    } catch (error) {
      closeModalForClientDetails();
      setClientDetails(null);
      console.log(error);
      toast.error("Something went wrong, Try again");
    } finally {
      setClientDetailsIsLoading(false);
    }
  };

  const { data: managers, refetch: managersRefetch } = useQuery({
    queryKey: ["managers", "owner"],
    queryFn: async () => {
      console.log("Managers are fetching for Owner");
      const { data } = await axios.get("/api/managers/getmanagers");
      return data.managers;
    },
    enabled: user?._id && user?.role == "owner" ? true : false,
  });

  const [clientName, setClientName] = useState("");
  const { data: clients, refetch: clientRefetch } = useQuery({
    queryKey: ["clients", "manager", user?._id, clientName],
    queryFn: async ({ queryKey }) => {
      const { data } = await axios.get(
        `/api/clients/getclients?id=${queryKey[2]}&onlyApproved=0&clientName=${clientName}`
      );
      return data.clients;
    },
    enabled: user?._id && user?.role == "manager" ? true : false,
  });
  const { data: mealRequestCount = 0 } = useQuery({
    queryKey: ["mealRequests", "manager", user?._id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/mealrequests/mealrequestscount`);
      if (data.success) return data.count;
      else return 0;
    },
    enabled: user?._id && user?.role == "manager" ? true : false,
  });

  const logout = async () => {
    setLoggingOut(true);
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
    } finally {
      setLoggingOut(false);
    }
  };

  //! Get current month
  useEffect(() => {
    if (
      user?.role === "client" ||
      user?.role === "manager" ||
      user?.role === "owner"
    ) {
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
    enabled: user?._id && user?.role == "client" ? true : false,
  });
  const { data: depositeAmount } = useQuery({
    queryKey: ["depositeAmount", "user", user?._id],
    queryFn: async ({ queryKey }) => {
      try {
        const { data } = await axios.get(
          `/api/bills/getbills?userId=${queryKey[2]}&month=${currentMonth}&year=${currentYear}`
        );
        if (data.success) return data.bills[0].paidBillInBDT;
        else return 0;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    enabled: user?._id && user?.role == "client" ? true : false,
  });

  const { data: managerCalanderData, refetch: managerCalanderDataRefetch } =
    useQuery({
      queryKey: ["managerCalanderData", "manager", user?._id],
      queryFn: async ({ queryKey }) => {
        try {
          const { data } = await axios.post("/api/markets/getmarkets", {
            managerId: queryKey[2],
            month: currentMonth,
            year: currentYear,
          });
          console.log("Manager Calander Loading");
          return data.market;
        } catch (error) {
          console.log(error);
          return null;
        }
      },
      enabled: user?._id && user?.role == "manager" ? true : false,
    });

  const { data: ordersForTheMonth, refetch: ordersForTheMonthRefetch } =
    useQuery({
      queryKey: ["allOrdersForCurrentMonth", "manager", user?._id],
      queryFn: async ({ queryKey }) => {
        try {
          const { data } = await axios.post("/api/orders/getordersformanager", {
            managerId: queryKey[2],
            month: currentMonth,
            year: currentYear,
          });
          console.log("Manager All Orders Loading");
          return data.orders.filter(
            (d) =>
              parseInt(d.date.split("/")[1]) <=
              parseInt(
                new Date().toLocaleDateString("en-BD", {
                  day: "numeric",
                  timeZone: "Asia/Dhaka",
                })
              )
          );
        } catch (error) {
          console.log(error);
          return null;
        }
      },
      enabled: user?._id && user?.role == "manager" ? true : false,
    });

  //! Get Breakfast, Lunch and Dinner count
  useEffect(() => {
    if (calanderData) {
      const breakfast = calanderData.reduce(
        (accumulator, currentValue) =>
          accumulator + (currentValue.breakfast ? 1 : 0),
        0
      );
      const extraBreakfast = calanderData
        .filter((d) => d.isGuestMeal && d.guestBreakfastCount > 0)
        .reduce(
          (accumulator, currentValue) =>
            accumulator + parseInt(currentValue.guestBreakfastCount),
          0
        );
      setBreakfastCount(breakfast + extraBreakfast);
      const lunch = calanderData.reduce(
        (accumulator, currentValue) =>
          accumulator + (currentValue.lunch ? 1 : 0),
        0
      );
      const extraLunch = calanderData
        .filter((d) => d.isGuestMeal && d.guestLunchCount > 0)
        .reduce(
          (accumulator, currentValue) =>
            accumulator + parseInt(currentValue.guestLunchCount),
          0
        );
      setLunchCount(lunch + extraLunch);
      const dinner = calanderData.reduce(
        (accumulator, currentValue) =>
          accumulator + (currentValue.dinner ? 1 : 0),
        0
      );
      const extraDinner = calanderData
        .filter((d) => d.isGuestMeal && d.guestDinnerCount > 0)
        .reduce(
          (accumulator, currentValue) =>
            accumulator + parseInt(currentValue.guestDinnerCount),
          0
        );
      setDinnerCount(dinner + extraDinner);
    }
  }, [calanderData]);
  if (
    !user ||
    (user.role === "owner" && !managers) ||
    (user.role === "manager" &&
      (!currentDays || !ordersForTheMonth || !managerCalanderData)) ||
    (user.role === "client" && (!manager || !currentDays || !calanderData))
  )
    return <PreLoader />;
  if (user?.success == false) route.push("/");
  return (
    <div className="select-none">
      {/*//! Modal for Client Details  */}
      <Modal
        // appElement={el}
        isOpen={clientDetailsModalIsOpen}
        onRequestClose={closeModalForClientDetails}
        style={customStylesForclientDetailsModal}
      >
        {clientDetails && (
          <div className="dark:bg-gradient-to-r dark:from-primary dark:to-secondary bg-white dark:text-white font-semibold p-10 h-[90vh] overflow-y-scroll">
            <div className="flex items-center gap-10">
              <div className="mb-4">
                <Image
                  width={150}
                  height={150}
                  src={clientDetails.profilePicture}
                  alt="Profile Picture"
                  className="object-cover aspect-square rounded-full"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {clientDetails.username}
                </h1>
                <p className="mb-2">Email: {clientDetails.email}</p>
                <p>
                  Floor: {clientDetails.floor}
                  <sup>th</sup> Floor - {clientDetails.floor + 1} Tala
                </p>
                <p>
                  Room Number:{" "}
                  {clientDetails.roomNumber.split("")[0].toUpperCase() +
                    "-" +
                    clientDetails.roomNumber.split("")[1]}
                </p>
                <p className="mb-1">
                  Contact Number: {clientDetails.contactNumber}
                </p>
                <p className="mb-1">
                  Father&apos;s Number: {clientDetails.fathersNumber}
                </p>
                <p className="mb-1">
                  Mother&apos;s Number: {clientDetails.mothersNumber}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-6 my-6">
              {clientDetails.nidFrontPicture && (
                <div className="">
                  <Image
                    width={400}
                    height={170}
                    src={clientDetails.nidFrontPicture}
                    alt="NID Photo Front"
                    className="object-cover rounded-lg"
                  />
                </div>
              )}
              {clientDetails.nidBackPicture && (
                <div>
                  <Image
                    width={400}
                    height={170}
                    src={clientDetails.nidBackPicture}
                    alt="NID Photo Back"
                    className="object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
            {clientDetails.birthCertificatePicture && (
              <div className="mb-4 flex justify-center">
                <Image
                  width={300}
                  height={700}
                  src={clientDetails.birthCertificatePicture}
                  alt="Birth Certificate"
                  className="object-cover rounded-lg"
                />
              </div>
            )}
            <div className="flex items-center justify-center gap-4 my-10">
              <button
                onClick={async () => {
                  const confirmation = confirm(
                    "Are you sure to decline your client?"
                  );
                  if (confirmation) {
                    //! Here
                    setDeclining(true);
                    try {
                      const { data } = await axios.post(
                        "api/clients/declineclient",
                        { id: clientDetails._id }
                      );
                      if (data.success) {
                        await clientRefetch();
                        toast.success("Client Declined");
                      }
                    } catch (error) {
                      console.log("Frontend problem when declining a client");
                      console.log(error);
                      toast.error("Authorization Error!");
                    } finally {
                      setDeclining(false);
                      closeModalForClientDetails();
                    }
                  } else {
                    toast.success("Cancelled!");
                  }
                }}
                className="bg-red-500 text-white font-semibold px-4 py-1 rounded-full duration-300 flex items-center gap-1 active:scale-90"
              >
                Decline
                {declining && <CgSpinner className="animate-spin text-2xl" />}
              </button>
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
                        userId: clientDetails._id,
                        managerId: user._id,
                        days: parseInt(currentDays[currentDays.length - 1]),
                        currentMonthName: new Date().toLocaleDateString(
                          "en-BD",
                          {
                            month: "long",
                            timeZone: "Asia/Dhaka",
                          }
                        ),
                        currentDateNumber: parseInt(
                          new Date().toLocaleDateString("en-BD", {
                            day: "numeric",
                            timeZone: "Asia/Dhaka",
                          })
                        ),
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
                        { id: clientDetails._id }
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
                      closeModalForClientDetails();
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
            </div>
          </div>
        )}
      </Modal>
      {/*//! NavBar Panel  */}
      <div className="p-6 flex flex-col-reverse gap-3 items-center md:flex-row-reverse md:gap-0 justify-between dark:bg-gradient-to-r dark:from-primary dark:to-secondary dark:text-white">
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-stone-900 font-bold px-4 py-1 flex items-center gap-3 rounded-lg duration-300 active:scale-90"
        >
          Logout
          {loggingOut && <CgSpinner className="animate-spin text-2xl" />}
        </button>
        {user.role === "client" && user.isVerified && user.isClientVerified && (
          <>
            <p className="text-lg border rounded-xl border-sky-500 px-8 py-1.5">
              Dinner: {dinnerCount}
            </p>
            <p className="text-lg border rounded-xl border-sky-500 px-8 py-1.5">
              Lunch: {lunchCount}
            </p>
            <p className="text-lg border rounded-xl border-sky-500 px-8 py-1.5">
              Breakfast: {breakfastCount}
            </p>
          </>
        )}
        <p className="text-lg bg-sky-500 rounded-xl font-semibold px-6 py-1.5">
          My Profile
        </p>
      </div>
      {/*//! Parent Block ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 dark:bg-gradient-to-r dark:from-primary dark:to-secondary dark:text-white">
        {/*//! Profile Details  */}
        <div className={`mt-10 py-8 flex flex-col items-center relative`}>
          {user && user.role == "manager" && (
            <div className="absolute top-0 right-4 dark:bg-stone-700 bg-stone-300 flex items-center justify-center h-12 w-12 rounded-full cursor-pointer duration-300 active:scale-90 select-none">
              <BsChatSquareQuote className="text-xl" />
              {parseInt(mealRequestCount) > 0 && (
                <span className="absolute top-0 right-0 text-sm bg-red-500 rounded-full h-[18px] w-[18px] flex items-center justify-center">
                  {parseInt(mealRequestCount)}
                </span>
              )}
            </div>
          )}
          <Image
            alt={`Profile picture of ${user.username}`}
            src={user.profilePicture}
            width={200}
            height={200}
            className="mb-10 rounded-full aspect-square"
          />
          <p className="mb-1 text-blue-500 font-medium text-xl">
            {user.username}
          </p>
          <p>{user.email}</p>
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
          ) : canVerify ? (
            <button
              onClick={async () => {
                setCanVerify(false);
                axios.post("/api/sendverificationemail", {
                  userName: user.username,
                  email: user.email,
                  emailType: "verify",
                  userId: user._id,
                });
                toast.success("Verification E-mail sent");
              }}
              className="flex items-center gap-1 duration-300 bg-sky-500 w-max px-4 py-1 rounded-full font-semibold mt-2 active:scale-90"
            >
              Verify Please
            </button>
          ) : (
            <p
              className={`flex items-center gap-1 w-max px-4 py-1 rounded-full font-semibold mt-2 bg-lime-500 select-none`}
            >
              <TiTick className="text-xl" />
              Verification E-mail sent
            </p>
          )}
        </div>
        {/*//! Clalnder as a Client */}
        {user.role == "client" && user.isVerified && user.isClientVerified && (
          <div className="col-span-1 md:col-span-2 px-6 pb-8 mt-10">
            <p className="text-center text-xl font-semibold border border-sky-500 rounded-xl px-4 py-2 relative flex flex-col md:flex-row gap-3 md:gap-0+6 items-center justify-between">
              <span className="text-sm text-sky-500">
                Deposite Amount - {depositeAmount} BDT
              </span>
              <span> {currentMonth}</span>
              <span className="text-sm text-sky-500">
                Approx. Bill -{" "}
                {breakfastCount * 30 + lunchCount * 60 + dinnerCount * 60 + 500}{" "}
                BDT
              </span>
            </p>
            <div className="mt-6 flex items-center justify-center flex-wrap gap-4">
              <Tooltip className="z-50" id="my-tooltip" />
              {calanderData.map((order) => (
                <div
                  data-tooltip-id="my-tooltip"
                  data-tooltip-content={
                    order.isGuestMeal
                      ? "Breakfast : " +
                        order.guestBreakfastCount +
                        " Lunch : " +
                        order.guestLunchCount +
                        " Dinner : " +
                        order.guestDinnerCount
                      : null
                  }
                  key={order._id}
                  className={`${
                    order.isGuestMeal && "shadow-lg shadow-white"
                  } relative w-16 h-16 rounded-xl bg-sky-500 flex items-center justify-center z-0`}
                >
                  {order.date.split("/")[1]}
                  <span
                    className={`absolute w-2 h-2 rounded-full top-2 right-2 ${
                      order.isGuestMeal ? "bg-blue-600" : "bg-transparent"
                    }`}
                  ></span>
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
        {/*//! Manager's Details  */}
        {user.role === "client" && !user.isVerified ? (
          <div className="flex items-center justify-center pl-6 py-8 mt-10">
            <p className="font-semibold shadow-xl shadow-blue-500 px-8 select-none py-2 rounded-full">
              At first verify youself!
            </p>
          </div>
        ) : user.role === "client" &&
          user.isVerified &&
          !user.isClientVerified ? (
          <div className="flex items-center justify-center pl-6 py-8 mt-10">
            <p className="font-semibold shadow-xl shadow-blue-500 px-8 select-none py-2 rounded-full w-max">
              Wait till manager accepts you!
            </p>
          </div>
        ) : user.role === "client" &&
          user.isVerified &&
          user.isClientVerified ? (
          <div className={`mt-10 py-8 flex flex-col items-center`}>
            <Image
              alt={`Profile picture of ${manager.username}`}
              src={manager.profilePicture}
              width={200}
              height={200}
              className="mb-10 rounded-full aspect-square"
            />
            <p className="mb-1 text-blue-500 font-medium text-xl">
              {manager.username}
            </p>
            <p>{manager.email}</p>
            <p>{manager.contactNumber}</p>
          </div>
        ) : (
          <></>
        )}
        {/*//! Managers as a Owner  */}
        {user.role === "owner" && (
          <div className="col-span-1 md:col-span-2 h-[380px] overflow-y-scroll px-3 flex flex-col items-center gap-4 mt-10 relative">
            <button
              onClick={async () => {
                try {
                  toast.success("Started");
                } catch (error) {
                  console.log(error);
                }
                // if (data.success) toast.success("Test E-mail Sent");
              }}
              className="font-semibold px-3 py-1 duration-300 bg-sky-500 text-white active:scale-90"
            >
              E-mail
            </button>
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
                            const confirmation = confirm(
                              "Are you sure to Authorize?"
                            );
                            if (confirmation) {
                              setGivingAuthorization(true);
                              try {
                                const { data } = await axios.post(
                                  "api/managers/approvemanager",
                                  {
                                    id: manager._id,

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
                                  }
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
        {/*//! Clients as a manager  */}
        {user.role === "manager" &&
        user.isVerified &&
        user.isManagerVerified ? (
          <div className="col-span-1 md:col-span-2 h-[380px] overflow-x-hidden overflow-y-scroll px-3 flex flex-col items-center gap-4 mt-10 relative">
            <div className=" pb-2 bg-transparent w-[110%] flex justify-center sticky top-0">
              <div className="relative">
                <input
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Search by name"
                  type="text"
                  className="w-80 px-4 pl-12 py-3 rounded-full dark:text-white font-semibold dark:bg-stone-800 bg-stone-300 focus:outline-none"
                />
                <IoSearchOutline className="absolute top-1/2 -translate-y-1/2 left-4 text-lg" />
              </div>
            </div>

            {clientName && !clients ? (
              <p className="mt-4 flex items-center gap-1 font-semibold">
                <CgSpinner className="animate-spin text-lg" />
                Loading...
              </p>
            ) : (
              clients?.map((client, i) => (
                <div
                  key={client._id}
                  className="border px-6 py-5 rounded-lg flex flex-col md:flex-row items-center w-[95%] justify-between gap-4"
                >
                  <p>{i + 1}</p>
                  <Image
                    alt={`Profile picture of ${client.username} who is a manager`}
                    src={client.profilePicture}
                    height={60}
                    width={60}
                    className="rounded-full aspect-square"
                  />
                  <div className="md:w-[900px] md:overflow-x-hidden text-center md:text-left">
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
                            onClick={() =>
                              getDetailsOfClientForApproval(client._id)
                            }
                            className="bg-green-500 text-white font-semibold px-4 py-1 rounded-full duration-300 flex items-center gap-1 active:scale-90"
                          >
                            Details{" "}
                            {clientDetailsIsLoading && (
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
                  <Link href={`/userDetails/${client._id}`}>
                    <button className="font-semibold flex items-center gap-2 bg-blue-500 px-3 py-1 duration-300 active:scale-90">
                      Details <FaArrowRight />
                    </button>
                  </Link>
                </div>
              ))
            )}
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
        {/*//! Settings Part & me as a manager  */}
        {user.role === "manager" &&
        user.isVerified &&
        user.isManagerVerified ? (
          <div className="px-3 my-auto relative flex items-center justify-center">
            <div className="flex flex-col items-center justify-center flex-wrap gap-5">
              <Link href="/orderStatus" className="group">
                <button className="border-sky-500 border text-white p-2 font-semibold duration-300 active:scale-90 w-[200px] flex items-center gap-5">
                  <FaArrowRight className="border border-sky-500 h-8 w-8 p-2 shadow-md duration-300 shadow-sky-500" />
                  Order Status
                </button>
              </Link>
              <Link href={"/billQuery"}>
                <button className="border-sky-500 border text-white p-2 font-semibold duration-300 active:scale-90 w-[200px] flex items-center gap-5">
                  <FaArrowRight className="border border-sky-500 h-8 w-8 p-2 shadow-md duration-300 shadow-sky-500" />
                  Bill Query
                </button>
              </Link>
              <Link href="/userQuery">
                <button className="border-sky-500 border text-white p-2 font-semibold duration-300 active:scale-90 w-[200px] flex items-center gap-5">
                  <FaArrowRight className="border border-sky-500 h-8 w-8 p-2 shadow-md duration-300 shadow-sky-500" />
                  User Query
                </button>
              </Link>
              <Link href="/marketQuery">
                <button className="border-sky-500 border text-white p-2 font-semibold duration-300 active:scale-90 w-[200px] flex items-center gap-5">
                  <FaArrowRight className="border border-sky-500 h-8 w-8 p-2 shadow-md duration-300 shadow-sky-500" />
                  Market Query
                </button>
              </Link>
              <Link href="/managerOrder">
                <button className="border-sky-500 border text-white p-2 font-semibold duration-300 active:scale-90 w-[200px] flex items-center gap-5">
                  <FaArrowRight className="border border-sky-500 h-8 w-8 p-2 shadow-md duration-300 shadow-sky-500" />
                  Meal Updator
                </button>
              </Link>
              <button
                onClick={async () => {
                  const { data } = await axios.get("/api/cronjob/createorders");
                  if (data.success) toast.success("Cron Job Done");
                  else toast.error("Cron Job Error");
                }}
                className="bg-sky-500 text-white px-4 py-2 rounded-full font-semibold duration-300 active:scale-90 hidden"
              >
                Cron Job
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
        {/*//! Clalnder as a Manager*/}
        {user.role == "manager" &&
          user.isVerified &&
          user.isManagerVerified && (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 md:pl-6 pb-8 mt-10">
              <p className="font-semibold border border-sky-500 rounded-sm px-4 py-2 relative flex items-center justify-around md:justify-around">
                <input
                  placeholder="Enter Amount"
                  onChange={(e) => setManagerAmount(parseInt(e.target.value))}
                  value={
                    managerAmount || managerAmount == 0 ? managerAmount : ""
                  }
                  className="w-[200px] px-5 py-1 outline-none rounded-full dark:bg-stone-800 bg-stone-300"
                  type="number"
                />
                <span className="md:w-[300px]">{currentMonth}</span>
              </p>
              <div className="mt-6 flex items-center justify-center flex-wrap gap-4">
                {managerCalanderData?.data?.map((mrkt) => (
                  <div
                    key={mrkt._id}
                    className="relative w-[110px] h-20 rounded-md bg-sky-500 flex items-center justify-center flex-col cursor-pointer after:h-0 after:w-full after:absolute after:bg-[rgba(0,0,0,0.5)] hover:after:h-full after:duration-300 transition-all group"
                  >
                    {!isMoneyAdding ? (
                      <GiPayMoney
                        onClick={async () => {
                          if (managerAmount != null && managerAmount >= 0) {
                            setIsMoneyAdding(true);
                            await axios.put("/api/markets/updatemarket", {
                              id1: managerCalanderData._id,
                              id2: mrkt._id,
                              amount: managerAmount,
                            });
                            await managerCalanderDataRefetch();
                            setManagerAmount(null);
                            setIsMoneyAdding(false);
                            toast.success("Amount updated");
                          } else {
                            toast.error("Please enter amount");
                          }
                        }}
                        className="scale-0 group-hover:scale-100 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sky-500 bg-white z-10 text-[40px] p-1 rounded-md duration-300 transition-all active:scale-90"
                      />
                    ) : (
                      <div className="bg-white z-10 hidden group-hover:block absolute rounded-md">
                        {" "}
                        <CgSpinner className="text-sky-500 text-[40px] p-1  duration-300 transition-all active:scale-90 group-hover:animate-spin" />
                      </div>
                    )}
                    <span className="font-semibold bg-white text-sky-500 px-2 py-1 rounded-md mb-2 select-none">
                      {" "}
                      {mrkt.date.split("/")[1] +
                        "-" +
                        mrkt.date.split("/")[0] +
                        "-" +
                        mrkt.date.split("/")[2]}
                    </span>

                    <span className="select-none">{mrkt.amount} /-</span>
                    {/* <span
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
                    ></span> */}
                  </div>
                ))}
              </div>
            </div>
          )}
        {/*//! Meal Rate as a Manager ------------ Working Stage*/}
        {user.role == "manager" &&
          user.isVerified &&
          user.isManagerVerified && (
            <div className="py-5 md:py-0 md:p-10 md:mt-20 mx-auto">
              <p className="flex items-center gap-2 mb-5">
                Current Meal Rate:{" "}
                <span className="text-blue-500 font-extralight text-4xl">
                  {" "}
                  {(
                    managerCalanderData?.data.reduce(
                      (accumulator, currentValue) =>
                        accumulator + currentValue.amount,
                      0
                    ) /
                    (ordersForTheMonth.reduce(
                      (accumulator, currentValue) =>
                        accumulator + (currentValue.breakfast ? 0.5 : 0),
                      0
                    ) +
                      ordersForTheMonth.reduce(
                        (accumulator, currentValue) =>
                          accumulator +
                          (currentValue.isGuestMeal &&
                          currentValue.guestBreakfastCount > 0
                            ? currentValue.guestBreakfastCount / 2
                            : 0),
                        0
                      ) +
                      ordersForTheMonth.reduce(
                        (accumulator, currentValue) =>
                          accumulator + (currentValue.lunch ? 1 : 0),
                        0
                      ) +
                      ordersForTheMonth.reduce(
                        (accumulator, currentValue) =>
                          accumulator +
                          (currentValue.isGuestMeal &&
                          currentValue.guestLunchCount > 0
                            ? currentValue.guestLunchCount
                            : 0),
                        0
                      ) +
                      ordersForTheMonth.reduce(
                        (accumulator, currentValue) =>
                          accumulator + (currentValue.dinner ? 1 : 0),
                        0
                      ) +
                      ordersForTheMonth.reduce(
                        (accumulator, currentValue) =>
                          accumulator +
                          (currentValue.isGuestMeal &&
                          currentValue.guestDinnerCount > 0
                            ? currentValue.guestDinnerCount
                            : 0),
                        0
                      ))
                  ).toFixed(2)}
                </span>
              </p>
              <p>
                Total Market:{" "}
                <span className="text-blue-500 font-bold text-2xl">
                  {managerCalanderData.data
                    .filter(
                      (d) =>
                        parseInt(d.date.split("/")[1]) <=
                        parseInt(
                          new Date().toLocaleDateString("en-BD", {
                            day: "numeric",
                            timeZone: "Asia/Dhaka",
                          })
                        )
                    )
                    .reduce(
                      (accumulator, currentValue) =>
                        accumulator + currentValue.amount,
                      0
                    )}
                </span>{" "}
                BDT
              </p>
              <p>
                Total meal count:
                <span className="text-blue-500 font-bold text-2xl">
                  {" "}
                  {ordersForTheMonth.reduce(
                    (accumulator, currentValue) =>
                      accumulator + (currentValue.breakfast ? 0.5 : 0),
                    0
                  ) +
                    ordersForTheMonth.reduce(
                      (accumulator, currentValue) =>
                        accumulator +
                        (currentValue.isGuestMeal &&
                        currentValue.guestBreakfastCount > 0
                          ? currentValue.guestBreakfastCount / 2
                          : 0),
                      0
                    ) +
                    ordersForTheMonth.reduce(
                      (accumulator, currentValue) =>
                        accumulator + (currentValue.lunch ? 1 : 0),
                      0
                    ) +
                    ordersForTheMonth.reduce(
                      (accumulator, currentValue) =>
                        accumulator +
                        (currentValue.isGuestMeal &&
                        currentValue.guestLunchCount > 0
                          ? currentValue.guestLunchCount
                          : 0),
                      0
                    ) +
                    ordersForTheMonth.reduce(
                      (accumulator, currentValue) =>
                        accumulator + (currentValue.dinner ? 1 : 0),
                      0
                    ) +
                    ordersForTheMonth.reduce(
                      (accumulator, currentValue) =>
                        accumulator +
                        (currentValue.isGuestMeal &&
                        currentValue.guestDinnerCount > 0
                          ? currentValue.guestDinnerCount
                          : 0),
                      0
                    )}
                </span>
              </p>
            </div>
          )}
      </div>
    </div>
  );
};

export default Profile;
