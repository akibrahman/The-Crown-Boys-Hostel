"use client";

import PreLoader from "@/Components/PreLoader/PreLoader";
import { AuthContext } from "@/providers/ContextProvider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useContext, useRef, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { FaTimes } from "react-icons/fa";
import Modal from "react-modal";
import { motion } from "framer-motion";
import Image from "next/image";
import { useReactToPrint } from "react-to-print";
import toast from "react-hot-toast";
import OrderStatusComponent from "./OrderStatusComponent";
import OrderStatusCustomDateComponent from "./OrderStatusCustomDateComponent";

const ManagerOrderStatusComponent = () => {
  const route = useRouter();
  const { user } = useContext(AuthContext);

  const currentDate = new Date();

  //! Today's date
  const todayDateString = currentDate.toLocaleDateString("en-US", {
    timeZone: "Asia/Dhaka",
  });
  //! Yesterday's date
  const yesterday = new Date(currentDate);
  yesterday.setDate(currentDate.getDate() - 1);
  const yesterdayDateString = yesterday.toLocaleDateString("en-US", {
    timeZone: "Asia/Dhaka",
  });
  //! Tomorrow's date
  const tomorrow = new Date(currentDate);
  tomorrow.setDate(currentDate.getDate() + 1);
  const tomorrowDateString = tomorrow.toLocaleDateString("en-US", {
    timeZone: "Asia/Dhaka",
  });

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orderStatus", user?._id],
    queryFn: async () => {
      try {
        const { data } = await axios.get(
          `/api/orders/m/orderstatus?yesterday=${yesterdayDateString}&today=${todayDateString}&tomorrow=${tomorrowDateString}`
        );
        if (data.success) {
          return data.orders;
        } else {
          return null;
        }
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    enabled: user?._id ? true : false,
  });
  //todo: Order Calculation
  const orderOfToday = orders
    ?.filter((order) => order.date == todayDateString)
    .sort((a, b) => a.user.floor - b.user.floor);
  const orderOfTomorrow = orders
    ?.filter((order) => order.date == tomorrowDateString)
    .sort((a, b) => a.user.floor - b.user.floor);
  const orderOfYesterday = orders
    ?.filter((order) => order.date == yesterdayDateString)
    .sort((a, b) => a.user.floor - b.user.floor);

  // Function to Identify the Lunch or Dinner
  function getTimeRange() {
    const bangladeshTimeOffset = 6 * 60;
    const now = new Date();

    const bangladeshTime = new Date(
      now.getTime() + bangladeshTimeOffset * 60 * 1000
    );
    const hours = bangladeshTime.getUTCHours();

    if (hours >= 10 && hours < 18) {
      return 1; // 10 AM to 6 PM
    } else if (hours >= 18 || hours < 1) {
      return 2; // 6 PM to 1 AM
    } else {
      return 3;
    }
  }

  //! For Modal
  const [modalIsOpen, setIsOpen] = useState(false);
  const [showPosPrint, setShowPosPrint] = useState(false);
  const [posPrintData, setPosPrintData] = useState([]);

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      // backgroundColor: "#000",
      // border: "1px solid #EAB308",
      padding: "0",
      width: "90%",
      // overflow: "scroll",
      // height: "90%",
    },
    overlay: {
      zIndex: 500,
      backgroundColor: "rgba(0,0,0,0.5)",
    },
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  //! Floor Analyzing Part
  const findHighestFloor = (array) => {
    let highestFloor = -Infinity;

    for (let obj of array) {
      if (obj.user.floor > highestFloor) {
        highestFloor = obj.user.floor;
      }
    }
    return highestFloor;
  };
  const [floorAnalysingData, setFloorAnalysingData] = useState([]);
  const [tab, setTab] = useState(1);
  const floorAnalyzer = (orders) => {
    const rooms = ["a1", "a2", "a3", "a4", "a5", "a6", "b1", "b2", "b3", "b4"];
    const analyzedData = [];
    const maxFloor = findHighestFloor(orders);
    for (let i = 0; i <= maxFloor; i++) {
      let breakfast = 0;
      let lunch = 0;
      let dinner = 0;
      let ordersArray = [];
      let ab = 0;
      let al = 0;
      let ad = 0;
      let bb = 0;
      let bl = 0;
      let bd = 0;
      orders
        .filter((order) => order.user.floor == i)
        .forEach((order) => {
          order.breakfast ? (breakfast += 1) : null;
          order.lunch ? (lunch += 1) : null;
          order.dinner ? (dinner += 1) : null;
        });
      orders
        .filter((order) => order.user.floor == i)
        .forEach((order) => {
          order.isGuestMeal &&
            order.guestBreakfastCount > 0 &&
            (breakfast += order.guestBreakfastCount);
          order.isGuestMeal &&
            order.guestLunchCount > 0 &&
            (lunch += order.guestLunchCount);
          order.isGuestMeal &&
            order.guestDinnerCount > 0 &&
            (dinner += order.guestDinnerCount);
        });
      orders
        .filter((order) => order.user.floor == i)
        .forEach((order) => {
          if (order.user.roomNumber.split("")[0] == "a") {
            order.breakfast ? (ab += 1) : null;
            order.isGuestMeal ? (ab += order.guestBreakfastCount) : null;
            order.lunch ? (al += 1) : null;
            order.isGuestMeal ? (al += order.guestLunchCount) : null;
            order.dinner ? (ad += 1) : null;
            order.isGuestMeal ? (ad += order.guestDinnerCount) : null;
          } else {
            order.breakfast ? (bb += 1) : null;
            order.isGuestMeal ? (bb += order.guestBreakfastCount) : null;
            order.lunch ? (bl += 1) : null;
            order.isGuestMeal ? (bl += order.guestLunchCount) : null;
            order.dinner ? (bd += 1) : null;
            order.isGuestMeal ? (bd += order.guestDinnerCount) : null;
          }
        });
      ordersArray.push({
        block: "A",
        b: ab,
        l: al,
        d: ad,
        t: ab + al + ad,
      });
      ordersArray.push({
        block: "B",
        b: bb,
        l: bl,
        d: bd,
        t: bb + bl + bd,
      });
      analyzedData.push({
        floor: i,
        orders: ordersArray,
        totalBreakfast: breakfast,
        totalLunch: lunch,
        totalDinner: dinner,
        totalMeal: breakfast + lunch + dinner,
      });
      ordersArray = [];
    }
    console.log(analyzedData);
    setFloorAnalysingData(analyzedData);
  };

  const pos = useRef();

  const printPos = useReactToPrint({
    content: () => pos.current,
    documentTitle: `Meal_${new Date().toLocaleString()}`,
    onBeforePrint: () => toast.success("Generating..."),
    onAfterPrint: () => {
      toast.success("Completed...");
      setShowPosPrint(false);
      setPosPrintData([]);
    },
  });

  if (!user) return <PreLoader />;
  if (user.role != "manager") {
    route.push("/");
    return;
  }

  if (!orders || isLoading)
    return (
      <div className="min-h-full bg-dashboard text-slate-100 font-semibold text-lg px-10 pb-20 flex items-center justify-center gap-2">
        Loading <CgSpinner className="text-xl animate-spin" />
      </div>
    );
  return (
    <>
      {showPosPrint && (
        <div className="fixed z-50 top-0 left-0 w-full h-screen bg-[rgba(0,0,0,0.5)]">
          <motion.div
            initial={{ scale: 0.5, x: "-50%", y: "-50%", opacity: 0 }}
            whileInView={{ scale: 1, x: "-50%", y: "-50%", opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="absolute top-[45%] md:top-1/2 left-1/2 bg-white md:h-[80%] w-[95%] md:w-[60%] rounded-xl font-medium py-10 md:py-0 overflow-y-scroll"
          >
            <div className="mt-3 md:mt-6 flex items-start justify-center gap-5">
              {/* Start  */}
              <div
                ref={pos}
                className="bg-white shadow-md rounded-md p-4 text-gray-500 w-[220px] border border-black"
              >
                <div className="flex justify-center mb-1">
                  <Image
                    src="/images/logo-black.png"
                    alt="The Crown Boys Hostel Logo"
                    className="h-16 w-20"
                    height="64"
                    width="80"
                    unoptimized
                  />
                </div>
                <h2 className="text-[16px] font-bold text-center text-black">
                  The Crown Boys Hostel
                </h2>
                <p className="text-xs text-center text-black font-semibold">
                  M/S Mijan Enterprise
                </p>
                <p className="text-xs text-center text-black font-semibold">
                  TRAD/DNCC/003483/2024
                </p>

                <p className="text-xs text-center text-black font-semibold">
                  Date:{" "}
                  {tab == 1
                    ? new Intl.DateTimeFormat("en-GB").format(
                        new Date(todayDateString)
                      )
                    : tab == 2
                    ? new Intl.DateTimeFormat("en-GB").format(
                        new Date(tomorrowDateString)
                      )
                    : new Intl.DateTimeFormat("en-GB").format(
                        new Date(yesterdayDateString)
                      )}{" "}
                  {new Date().toLocaleTimeString("en-BD", {
                    timeZone: "Asia/Dhaka",
                  })}
                </p>

                {getTimeRange() == "1" ? (
                  <p className="text-xs text-center text-black font-semibold">
                    Sehri
                  </p>
                ) : getTimeRange() == "2" ? (
                  <p className="text-xs text-center text-black font-semibold">
                    Dinner
                  </p>
                ) : (
                  <p className="text-xs text-center text-black font-semibold">
                    Both
                  </p>
                )}

                <div className="w-full my-3 flex flex-col gap-1 text-black font-semibold items-center text-sm">
                  {posPrintData.map((d) => (
                    <div
                      key={d._id}
                      className="flex flex-col gap-1 text-center text-sm"
                    >
                      <p>{d.user.username}</p>
                      {/* <p>
                        {(() => {
                          const parts = d.user.username.trim().split(" ");
                          if (parts.length === 1) {
                            return parts[0];
                          } else if (parts.length >= 2) {
                            return parts.slice(0, 2).join(" ");
                          }
                        })()}
                      </p> */}

                      {getTimeRange() == "1" ? (
                        <p>{d.guestLunchCount + (d.lunch ? 1 : 0)}</p>
                      ) : getTimeRange() == "2" ? (
                        <p>{d.guestDinnerCount + (d.dinner ? 1 : 0)}</p>
                      ) : (
                        <div className="flex items-center justify-center gap-1">
                          <p>{d.guestLunchCount + (d.lunch ? 1 : 0)}</p>
                          <p>-</p>
                          <p>{d.guestDinnerCount + (d.dinner ? 1 : 0)}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <p className="text-xs font-semibold text-black text-center mt-2">
                  Shaplar Mor, Kamarpara, Uttara-10, Dhaka, Bangladesh
                </p>
                <div className="text-[4.5px] font-bold flex items-center justify-evenly mt-1">
                  <p className="w-max">T/D No.: TRAD/DNCC/003483/2024</p>
                  <p className="w-max">TIN No.: 485681855868</p>
                  <p className="w-max">M/S MIJAN ENTERPRISE</p>
                </div>
              </div>
              {/* End  */}
              <button
                onClick={() => {
                  printPos();
                }}
                className="px-4 md:px-6 py-1 md:py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 active:scale-90"
              >
                Print
              </button>
              <button
                onClick={() => {
                  setShowPosPrint(false);
                  setPosPrintData([]);
                }}
                className="px-4 md:px-6 py-1 md:py-2 bg-red-500 text-white rounded hover:bg-red-500 transition duration-300 active:scale-90"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="min-h-full bg-dashboard text-slate-100 px-10 pb-20">
        <p className="text-center font-semibold text-2xl pt-6 dark:text-white">
          Order Status
        </p>
        {/* Tabs  */}
        <div className="flex items-center justify-evenly md:justify-center gap-0 md:gap-6 mt-4 md:mt-6">
          <button
            onClick={() => setTab(1)}
            className={`px-4 md:px-8 py-1 text-sm md:text-base rounded-md text-white font-semibold ${
              tab == 1 ? "bg-stroke-dark" : "bg-dark-black"
            } duration-300 active:scale-90 cursor-pointer`}
          >
            Today
          </button>
          <button
            onClick={() => setTab(2)}
            className={`px-4 md:px-8 py-1 text-sm md:text-base rounded-md text-white font-semibold ${
              tab == 2 ? "bg-stroke-dark" : "bg-dark-black"
            } duration-300 active:scale-90 cursor-pointer`}
          >
            Tomorrow
          </button>
          <button
            onClick={() => setTab(3)}
            className={`px-4 md:px-8 py-1 text-sm md:text-base rounded-md text-white font-semibold ${
              tab == 3 ? "bg-stroke-dark" : "bg-dark-black"
            } duration-300 active:scale-90 cursor-pointer`}
          >
            Yesterday
          </button>
          <button
            onClick={() => setTab(4)}
            className={`px-4 md:px-8 py-1 text-sm md:text-base rounded-md text-white font-semibold ${
              tab == 4 ? "bg-stroke-dark" : "bg-dark-black"
            } duration-300 active:scale-90 cursor-pointer`}
          >
            Custom Date
          </button>
        </div>
        {tab == 1 && (
          <OrderStatusComponent
            date={todayDateString}
            orders={orderOfToday}
            openModal={openModal}
            floorAnalyzer={floorAnalyzer}
            setPosPrintData={setPosPrintData}
            setShowPosPrint={setShowPosPrint}
          />
        )}

        {tab == 2 && (
          <OrderStatusComponent
            date={tomorrowDateString}
            orders={orderOfTomorrow}
            openModal={openModal}
            floorAnalyzer={floorAnalyzer}
            setPosPrintData={setPosPrintData}
            setShowPosPrint={setShowPosPrint}
          />
        )}

        {tab == 3 && (
          <OrderStatusComponent
            date={yesterdayDateString}
            orders={orderOfYesterday}
            openModal={openModal}
            floorAnalyzer={floorAnalyzer}
            setPosPrintData={setPosPrintData}
            setShowPosPrint={setShowPosPrint}
          />
        )}

        {tab == 4 && (
          <OrderStatusCustomDateComponent
            openModal={openModal}
            floorAnalyzer={floorAnalyzer}
            setPosPrintData={setPosPrintData}
            setShowPosPrint={setShowPosPrint}
          />
        )}
      </div>
    </>
  );
};

export default ManagerOrderStatusComponent;
