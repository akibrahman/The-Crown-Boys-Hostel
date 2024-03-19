"use client";

import { AuthContext } from "@/providers/ContextProvider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useState } from "react";
import Modal from "react-modal";

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
        const { data } = await axios.post("/api/managersOrder/getOrderStatus", {
          yesterday: yesterdayDateString,
          today: todayDateString,
          tomorrow: tomorrowDateString,
        });
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

  //! For Modal
  const [modalIsOpen, setIsOpen] = useState(true);

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#000",
      border: "none",
    },
    overlay: {
      backgroundColor: "rgba(0,0,0,0.5)",
    },
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

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
  const floorAnalyzer = (orders) => {
    const analyzedData = [];
    const maxFloor = findHighestFloor(orders);
    // console.log(orders, maxFloor);
    for (let i = 0; i <= maxFloor; i++) {
      let breakfast = 0;
      let lunch = 0;
      let dinner = 0;
      orders
        .filter((order) => order.user.floor == i)
        .forEach((order) => {
          order.breakfast ? (breakfast += 1) : null;
          order.lunch ? (lunch += 1) : null;
          order.dinner ? (dinner += 1) : null;
        });
      analyzedData.push({ floor: i, breakfast, lunch, dinner });
    }
    setFloorAnalysingData(analyzedData);
  };
  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        {floorAnalysingData.map((d, i) => (
          <p key={i}>
            {d.floor} <sup>th</sup> Floor - Breakfast: {d.breakfast} - Lunch:{" "}
            {d.lunch} - Dinner: {d.dinner}
          </p>
        ))}
      </Modal>
      <div className="mb-20">
        <p className="text-center font-semibold text-2xl">Order Status</p>
        {/* Order - Today  */}
        <div className="mt-10 bg-yellow-500 text-stone-800 p-4 rounded-md font-semibold text-lg flex items-center justify-between">
          <p className="w-[220px]">Today - {todayDateString}</p>
          <p className="">Breakfast - {breakfastOfToday}</p>
          <p className="">Lunch - {lunchOfToday}</p>
          <p className="">Dinner - {dinnerOfToday}</p>
          <button
            onClick={() => {
              openModal();
              floorAnalyzer(orderOfToday);
            }}
            className="bg-stone-700 text-white px-4 py-2 text-sm rounded-full active:scale-90 duration-300 hover:scale-x-110"
          >
            Floor Analysis
          </button>
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
          <p className="w-[220px]">Tomorrow - {tomorrowDateString}</p>
          <p className="">Breakfast - {breakfastOfTomorrow}</p>
          <p className="">Lunch - {lunchOfTomorrow}</p>
          <p className="">Dinner - {dinnerOfTomorrow}</p>
          <button
            onClick={() => {
              openModal();
              floorAnalyzer(orderOfTomorrow);
            }}
            className="bg-stone-700 text-white px-4 py-2 text-sm rounded-full active:scale-90 duration-300 hover:scale-x-110"
          >
            Floor Analysis
          </button>
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
          <p className="w-[220px]">Yesterday - {yesterdayDateString}</p>
          <p className="">Breakfast - {breakfastOfYesterday}</p>
          <p className="">Lunch - {lunchOfYesterday}</p>
          <p className="">Dinner - {dinnerOfYesterday}</p>
          <button
            onClick={() => {
              openModal();
              floorAnalyzer(orderOfYesterday);
            }}
            className="bg-stone-700 text-white px-4 py-2 text-sm rounded-full active:scale-90 duration-300 hover:scale-x-110"
          >
            Floor Analysis
          </button>
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
    </>
  );
};

export default OrderStatus;
