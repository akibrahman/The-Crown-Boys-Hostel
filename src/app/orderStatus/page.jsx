"use client";

import { AuthContext } from "@/providers/ContextProvider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";

const OrderStatus = () => {
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

  const { data: orders } = useQuery({
    queryKey: ["orderStatus", user?._id],
    queryFn: async () => {
      try {
        const { data } = await axios.get(
          `/api/managersOrder/getOrderStatus?yesterday=${yesterdayDateString}&today=${todayDateString}&tomorrow=${tomorrowDateString}`
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
  const orderOfToday = orders?.filter((order) => order.date == todayDateString);
  console.log("=>>", orderOfToday);
  const orderOfTomorrow = orders?.filter(
    (order) => order.date == tomorrowDateString
  );
  const orderOfYesterday = orders?.filter(
    (order) => order.date == yesterdayDateString
  );
  //todo: Order of Today Calculation
  const breakfastOfToday = orderOfToday?.filter(
    (order) => order.breakfast == true
  ).length;
  const lunchOfToday = orderOfToday?.filter(
    (order) => order.lunch == true
  ).length;
  const dinnerOfToday = orderOfToday?.filter(
    (order) => order.dinner == true
  ).length;
  //todo: Order of Tomorow Calculation
  const breakfastOfTomorrow = orderOfTomorrow?.filter(
    (order) => order.breakfast == true
  ).length;
  const lunchOfTomorrow = orderOfTomorrow?.filter(
    (order) => order.lunch == true
  ).length;
  const dinnerOfTomorrow = orderOfTomorrow?.filter(
    (order) => order.dinner == true
  ).length;
  //todo: Order of Yesterday Calculation
  const breakfastOfYesterday = orderOfYesterday?.filter(
    (order) => order.breakfast == true
  ).length;
  const lunchOfYesterday = orderOfYesterday?.filter(
    (order) => order.lunch == true
  ).length;
  const dinnerOfYesterday = orderOfYesterday?.filter(
    (order) => order.dinner == true
  ).length;
  return (
    <div>
      <p className="text-center font-semibold text-2xl">Order Status</p>
      {/* Order - Today  */}
      <div className="mt-10 bg-yellow-500 text-stone-800 p-4 rounded-md font-semibold text-lg flex items-center justify-between">
        <p className="">Today - {todayDateString}</p>
        <p className="">Breakfast - {breakfastOfToday}</p>
        <p className="">Lunch - {lunchOfToday}</p>
        <p className="">Dinner - {dinnerOfToday}</p>
      </div>
      {/* Order Details  */}
      <div className="text-sm bg-stone-700 px-5 py-2 my-2 rounded-md grid grid-cols-3 gap-6 justify-items-center">
        {orderOfToday?.map((order) => (
          <div className="flex items-center gap-8" key={order._id}>
            <p>{order.user.username}</p>
            <p>
              {order.user.floor + 1} - ( {order.user.floor}
              <sup>th</sup> Floor )
            </p>
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 ${
                  order.breakfast ? "bg-green-500" : "bg-red-500"
                } rounded-full block`}
              ></span>
              <span
                className={`w-2 h-2 ${
                  order.lunch ? "bg-green-500" : "bg-red-500"
                } rounded-full block`}
              ></span>
              <span
                className={`w-2 h-2 ${
                  order.dinner ? "bg-green-500" : "bg-red-500"
                } rounded-full block`}
              ></span>
            </div>
          </div>
        ))}
      </div>

      {/* Order - Tomorrow  */}
      <div className="mt-10 bg-yellow-500 text-stone-800 p-4 rounded-md font-semibold text-lg flex items-center justify-between">
        <p className="">Tomorrow - {tomorrowDateString}</p>
        <p className="">Breakfast - {breakfastOfTomorrow}</p>
        <p className="">Lunch - {lunchOfTomorrow}</p>
        <p className="">Dinner - {dinnerOfTomorrow}</p>
      </div>
      {/* Order Details  */}
      <div className="text-sm bg-stone-700 px-5 py-2 my-2 rounded-md grid grid-cols-3 gap-6 justify-items-center">
        {orderOfTomorrow?.map((order) => (
          <div className="flex items-center gap-8" key={order._id}>
            <p>{order.user.username}</p>
            <p>
              {order.user.floor + 1} - ( {order.user.floor}
              <sup>th</sup> Floor )
            </p>
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 ${
                  order.breakfast ? "bg-green-500" : "bg-red-500"
                } rounded-full block`}
              ></span>
              <span
                className={`w-2 h-2 ${
                  order.lunch ? "bg-green-500" : "bg-red-500"
                } rounded-full block`}
              ></span>
              <span
                className={`w-2 h-2 ${
                  order.dinner ? "bg-green-500" : "bg-red-500"
                } rounded-full block`}
              ></span>
            </div>
          </div>
        ))}
      </div>

      {/* Order - Yesterday  */}
      <div className="mt-10 bg-yellow-500 text-stone-800 p-4 rounded-md font-semibold text-lg flex items-center justify-between">
        <p className="">Yesterday - {yesterdayDateString}</p>
        <p className="">Breakfast - {breakfastOfYesterday}</p>
        <p className="">Lunch - {lunchOfYesterday}</p>
        <p className="">Dinner - {dinnerOfYesterday}</p>
      </div>
      {/* Order Details  */}
      <div className="text-sm bg-stone-700 px-5 py-2 my-2 rounded-md grid grid-cols-3 gap-6 justify-items-center">
        {orderOfYesterday?.map((order) => (
          <div className="flex items-center gap-8" key={order._id}>
            <p>{order.user.username}</p>
            <p>
              {order.user.floor + 1} - ( {order.user.floor}
              <sup>th</sup> Floor )
            </p>
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 ${
                  order.breakfast ? "bg-green-500" : "bg-red-500"
                } rounded-full block`}
              ></span>
              <span
                className={`w-2 h-2 ${
                  order.lunch ? "bg-green-500" : "bg-red-500"
                } rounded-full block`}
              ></span>
              <span
                className={`w-2 h-2 ${
                  order.dinner ? "bg-green-500" : "bg-red-500"
                } rounded-full block`}
              ></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderStatus;
