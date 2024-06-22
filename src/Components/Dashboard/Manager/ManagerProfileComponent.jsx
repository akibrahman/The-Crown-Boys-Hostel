"use client";
import { convertCamelCaseToCapitalized } from "@/utils/camelToCapitalize";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import "../dashboard.css";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const ManagerProfileComponent = ({ user }) => {
  const currentMonth = new Date().toLocaleDateString("en-BD", {
    month: "long",
    timeZone: "Asia/Dhaka",
  });
  const currentYear = new Date().toLocaleDateString("en-BD", {
    year: "numeric",
    timeZone: "Asia/Dhaka",
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
  const [totalMarketF, setTotalMarketF] = useState(0);
  const [totalMealCountF, setTotalMealCountF] = useState(0);
  const [mealRateF, setMealRateF] = useState(0);
  useEffect(() => {
    console.log("Calculating Meal rte Again");
    if (ordersForTheMonth && managerCalanderData) {
      const totalMarket = managerCalanderData.data
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
          (accumulator, currentValue) => accumulator + currentValue.amount,
          0
        );
      setTotalMarketF(totalMarket);
      const totalMealCount =
        ordersForTheMonth?.reduce(
          (accumulator, currentValue) =>
            accumulator + (currentValue.breakfast ? 0.5 : 0),
          0
        ) +
        ordersForTheMonth?.reduce(
          (accumulator, currentValue) =>
            accumulator +
            (currentValue.isGuestMeal && currentValue.guestBreakfastCount > 0
              ? currentValue.guestBreakfastCount / 2
              : 0),
          0
        ) +
        ordersForTheMonth?.reduce(
          (accumulator, currentValue) =>
            accumulator + (currentValue.lunch ? 1 : 0),
          0
        ) +
        ordersForTheMonth?.reduce(
          (accumulator, currentValue) =>
            accumulator +
            (currentValue.isGuestMeal && currentValue.guestLunchCount > 0
              ? currentValue.guestLunchCount
              : 0),
          0
        ) +
        ordersForTheMonth?.reduce(
          (accumulator, currentValue) =>
            accumulator + (currentValue.dinner ? 1 : 0),
          0
        ) +
        ordersForTheMonth?.reduce(
          (accumulator, currentValue) =>
            accumulator +
            (currentValue.isGuestMeal && currentValue.guestDinnerCount > 0
              ? currentValue.guestDinnerCount
              : 0),
          0
        );
      setTotalMealCountF(totalMealCount);
      const mealRate = (totalMarket / totalMealCount).toFixed(2);
      setMealRateF(mealRate);
    }
  }, [ordersForTheMonth, managerCalanderData]);

  // Socket Configuration
  const socket = useRef();
  useEffect(() => {
    socket.current = io("wss://the-crown-socket-server.glitch.me");
  }, []);
  useEffect(() => {
    socket.current.on("meal-rate-refetch", async () => {
      console.log("Got dta from Socket Server");
      await ordersForTheMonthRefetch();
      await managerCalanderDataRefetch();
    });
  });

  return user.role === "manager" && !user.isManagerVerified ? (
    <div className="flex items-center justify-center pl-6 py-2">
      <p className="font-semibold shadow-xl shadow-blue-500 px-8 select-none py-2 rounded-full w-max">
        Wait till Owner accepts you!
      </p>
    </div>
  ) : (
    user.role === "manager" && user.isVerified && user.isManagerVerified && (
      <div className="flex flex-col md:flex-row gap-4 items-center min-h-full px-20 md:px-32 py-5 bg-dashboard text-slate-100">
        <div className={`w-full md:w-1/2 py-8 flex flex-col items-center`}>
          <Image
            alt={`Profile picture of ${user.username}`}
            src={user.profilePicture}
            width={200}
            height={200}
            className="mb-5 rounded-full aspect-square"
          />
          <p className="mb-1 text-blue-500 font-medium text-xl">
            {user.username}
          </p>
          <p className="mb-1 text-blue-500 font-medium">
            {convertCamelCaseToCapitalized(user.role)}
          </p>
          {user.isVerified ? (
            <div className="flex flex-col md:flex-row items-center gap-3">
              <p
                className={`flex items-center gap-1 w-max px-4 py-1 rounded-full font-semibold ${
                  user.role === "owner" ? "text-blue-500" : "text-green-500"
                }`}
              >
                <TiTick className="text-xl" />
                Verified
              </p>
            </div>
          ) : (
            <p
              className={`flex items-center gap-1 w-max px-4 py-1 rounded-full font-semibold mt-2 bg-red-500 select-none`}
            >
              <FaTimes className="text-xl" />
              Unverified
            </p>
          )}
          <p>{user.email}</p>
          <p>{user.contactNumber}</p>
        </div>
        {!managerCalanderData || !ordersForTheMonth ? (
          <MealRateCalculatingEffect />
        ) : (
          <div className="w-full md:w-1/2">
            <div className="py-5 md:py-0 md:p-10 md:mt-20 mx-auto">
              <p className="flex items-center gap-2 mb-5">
                Current Meal Rate:
                <span className="text-blue-500 font-extralight text-4xl">
                  {mealRateF}
                </span>
                BDT
              </p>
              <p>
                Total Market:
                <span className="text-blue-500 font-bold text-2xl">
                  {totalMarketF}
                </span>
                BDT
              </p>
              <p>
                Total meal count:
                <span className="text-blue-500 font-bold text-2xl">
                  {totalMealCountF}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    )
  );
};

export default ManagerProfileComponent;

const MealRateCalculatingEffect = () => {
  return (
    <div class="meal-rate-calculating-loader">
      <div class="scanner">
        <span>Meal Rate Calculating...</span>
      </div>
    </div>
  );
};
