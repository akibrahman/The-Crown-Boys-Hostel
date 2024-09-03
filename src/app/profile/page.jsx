"use client";

import BlockMsg from "@/Components/BlockMsg/BlockMsg";
import PreLoader from "@/Components/PreLoader/PreLoader";
import { AuthContext } from "@/providers/ContextProvider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import Modal from "react-modal";
import CalenderClient from "./CalenderClient";
import CalenderManager from "./CalenderManager";
import ClientsOfManager from "./ClientsOfManager";
import ManagerDetails from "./ManagerDetails";
import ManagerMealRate from "./ManagerMealRate";
import ManagerSettings from "./ManagerSettings";
import ManagersOfOwner from "./ManagersOfOwner";
import ProfileDetails from "./ProfileDetails";
import ProfileNavbar from "./ProfileNavbar";

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

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
      const array = data.clients;
      array.sort((b, a) => {
        if (a.isClientVerified === b.isClientVerified) {
          return 0;
        } else if (a.isClientVerified) {
          return -1;
        } else {
          return 1;
        }
      });
      return array;
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
  if (user?.success == false) return route.push("/signin");
  if (
    user.blockDate &&
    moment(user.blockDate).isBefore(
      moment(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }),
        "M/D/YYYY, h:mm:ss A"
      )
    )
  )
    return <BlockMsg />;
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
      <ProfileNavbar
        logout={logout}
        loggingOut={loggingOut}
        user={user}
        breakfastCount={breakfastCount}
        lunchCount={lunchCount}
        dinnerCount={dinnerCount}
      />
      {/*//! Parent Block ------------------------------------ */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 dark:bg-gradient-to-r dark:from-primary dark:to-secondary dark:text-white">
        {/*//! Profile Details  */}
        <ProfileDetails
          user={user}
          mealRequestCount={mealRequestCount}
          setIsSettingsOpen={setIsSettingsOpen}
          isSettingsOpen={isSettingsOpen}
          canVerify={canVerify}
          setCanVerify={setCanVerify}
        />
        {/*//! Clalnder as a Client */}

        <CalenderClient
          user={user}
          depositeAmount={depositeAmount}
          currentMonth={currentMonth}
          breakfastCount={breakfastCount}
          lunchCount={lunchCount}
          dinnerCount={dinnerCount}
          calanderData={calanderData}
        />
        {/*//! Manager's Details  */}
        <ManagerDetails user={user} manager={manager} />

        {/*//! Client's Charges  */}
        {user.role == "client" && user.isVerified && user.isClientVerified && (
          <div className="pb-16">
            <div className="flex items-center justify-center gap-4">
              <p class="text-center tracking-wide text-white font-bold">
                Charges
              </p>
            </div>
            {user.charges.length == 0 && (
              <p className="text-center text-sm my-2 select-none">
                No Added Charges
              </p>
            )}
            {user.charges.length != 0 && (
              <table className="w-[90%] mx-auto yt-2">
                <thead className="bg-[rgba(0,0,200,0.2)]">
                  <tr>
                    <td className="border text-center py-1.5">Note</td>
                    <td className="border text-center py-1.5">Amount</td>
                  </tr>
                </thead>
                {user.charges.map((crg, i) => (
                  <tbody key={i} className="text-sm">
                    <tr>
                      <td className="border text-center py-1">{crg.note}</td>
                      <td className="border text-center py-1">{crg.amount}</td>
                    </tr>
                  </tbody>
                ))}
              </table>
            )}
            <div className="flex items-center justify-center gap-4">
              <p class="text-center tracking-wide text-white font-bold">
                Block Date
              </p>
            </div>
            {user.blockDate ? (
              <p className="text-center text-sm my-2 text-red-500 select-none">
                {new Date(user.blockDate).toDateString()}
              </p>
            ) : (
              <p className="text-center text-sm my-2 text-green-500 select-none">
                You are not scheduled to be Blocked
              </p>
            )}
          </div>
        )}
        {/*//! Managers as a Owner  */}
        <ManagersOfOwner
          user={user}
          managers={managers}
          managersRefetch={managersRefetch}
          givingAuthorization={givingAuthorization}
          setGivingAuthorization={setGivingAuthorization}
        />
        {/*//! Clients as a manager  */}
        <ClientsOfManager
          user={user}
          setClientName={setClientName}
          clientName={clientName}
          clients={clients}
          getDetailsOfClientForApproval={getDetailsOfClientForApproval}
          clientDetailsIsLoading={clientDetailsIsLoading}
        />
        {/*//! Settings Part & me as a manager  */}
        <ManagerSettings user={user} />
        {/*//! Clalnder as a Manager*/}
        <CalenderManager
          user={user}
          setManagerAmount={setManagerAmount}
          managerAmount={managerAmount}
          currentMonth={currentMonth}
          managerCalanderData={managerCalanderData}
          isMoneyAdding={isMoneyAdding}
          setIsMoneyAdding={setIsMoneyAdding}
          managerCalanderDataRefetch={managerCalanderDataRefetch}
        />
        {/*//! Meal Rate as a Manager*/}
        <ManagerMealRate
          user={user}
          managerCalanderData={managerCalanderData}
          ordersForTheMonth={ordersForTheMonth}
        />
      </div>
    </div>
  );
};

export default Profile;
