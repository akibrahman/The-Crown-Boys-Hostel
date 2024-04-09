"use client";

import { AuthContext } from "@/providers/ContextProvider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useState } from "react";
import { FaTimes } from "react-icons/fa";
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
  const breakfastOfToday =
    parseInt(orderOfToday?.filter((order) => order.breakfast == true).length) +
    parseInt(
      orderOfToday
        ?.filter(
          (order) => order.isGuestMeal == true && order.guestBreakfastCount > 0
        )
        .reduce(
          (accumulator, currentValue) =>
            accumulator + parseInt(currentValue.guestBreakfastCount),
          0
        )
    );
  const lunchOfToday =
    parseInt(orderOfToday?.filter((order) => order.lunch == true).length) +
    parseInt(
      orderOfToday
        ?.filter(
          (order) => order.isGuestMeal == true && order.guestLunchCount > 0
        )
        .reduce(
          (accumulator, currentValue) =>
            accumulator + parseInt(currentValue.guestLunchCount),
          0
        )
    );
  const dinnerOfToday =
    parseInt(orderOfToday?.filter((order) => order.dinner == true).length) +
    parseInt(
      orderOfToday
        ?.filter(
          (order) => order.isGuestMeal == true && order.guestDinnerCount > 0
        )
        .reduce(
          (accumulator, currentValue) =>
            accumulator + parseInt(currentValue.guestDinnerCount),
          0
        )
    );
  //todo: Order of Tomorow Calculation
  const breakfastOfTomorrow =
    parseInt(
      orderOfTomorrow?.filter((order) => order.breakfast == true).length
    ) +
    parseInt(
      orderOfTomorrow
        ?.filter(
          (order) => order.isGuestMeal == true && order.guestBreakfastCount > 0
        )
        .reduce(
          (accumulator, currentValue) =>
            accumulator + parseInt(currentValue.guestBreakfastCount),
          0
        )
    );
  const lunchOfTomorrow =
    parseInt(orderOfTomorrow?.filter((order) => order.lunch == true).length) +
    parseInt(
      orderOfTomorrow
        ?.filter(
          (order) => order.isGuestMeal == true && order.guestLunchCount > 0
        )
        .reduce(
          (accumulator, currentValue) =>
            accumulator + parseInt(currentValue.guestLunchCount),
          0
        )
    );
  const dinnerOfTomorrow =
    parseInt(orderOfTomorrow?.filter((order) => order.dinner == true).length) +
    parseInt(
      orderOfTomorrow
        ?.filter(
          (order) => order.isGuestMeal == true && order.guestDinnerCount > 0
        )
        .reduce(
          (accumulator, currentValue) =>
            accumulator + parseInt(currentValue.guestDinnerCount),
          0
        )
    );
  //todo: Order of Yesterday Calculation
  const breakfastOfYesterday =
    parseInt(
      orderOfYesterday?.filter((order) => order.breakfast == true).length
    ) +
    parseInt(
      orderOfYesterday
        ?.filter(
          (order) => order.isGuestMeal == true && order.guestBreakfastCount > 0
        )
        .reduce(
          (accumulator, currentValue) =>
            accumulator + parseInt(currentValue.guestBreakfastCount),
          0
        )
    );
  const lunchOfYesterday =
    parseInt(orderOfYesterday?.filter((order) => order.lunch == true).length) +
    parseInt(
      orderOfYesterday
        ?.filter(
          (order) => order.isGuestMeal == true && order.guestLunchCount > 0
        )
        .reduce(
          (accumulator, currentValue) =>
            accumulator + parseInt(currentValue.guestLunchCount),
          0
        )
    );
  const dinnerOfYesterday =
    parseInt(orderOfYesterday?.filter((order) => order.dinner == true).length) +
    parseInt(
      orderOfYesterday
        ?.filter(
          (order) => order.isGuestMeal == true && order.guestDinnerCount > 0
        )
        .reduce(
          (accumulator, currentValue) =>
            accumulator + parseInt(currentValue.guestDinnerCount),
          0
        )
    );

  //! For Modal
  const [modalIsOpen, setIsOpen] = useState(false);

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#000",
      border: "1px solid #EAB308",
      width: "90%",
      height: "90%",
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
  const compareRoomNumbers = (a, b) => {
    const roomOrder = {
      a: ["a1", "a2", "a3", "a4", "a5", "a6"],
      b: ["b1", "b2", "b3", "b4"],
    };
    const [aPrefix, aNumber] = [
      a.roomNumber[0],
      parseInt(a.roomNumber.slice(1)),
    ];
    const [bPrefix, bNumber] = [
      b.roomNumber[0],
      parseInt(b.roomNumber.slice(1)),
    ];

    if (aPrefix !== bPrefix) {
      return aPrefix.localeCompare(bPrefix);
    } else {
      return (
        roomOrder[aPrefix].indexOf(a.roomNumber) -
        roomOrder[bPrefix].indexOf(b.roomNumber)
      );
    }
  };
  const floorAnalyzer = (orders) => {
    const rooms = ["a1", "a2", "a3", "a4", "a5", "a6", "b1", "b2", "b3", "b4"];
    const analyzedData = [];
    const maxFloor = findHighestFloor(orders);
    for (let i = 0; i <= maxFloor; i++) {
      let breakfast = 0;
      let lunch = 0;
      let dinner = 0;
      let ordersArray = [];
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
      // orders
      //   .filter((order) => order.user.floor == i)
      //   .forEach((order) => {
      //     ordersArray.push({
      //       username: order.user.username,
      //       roomNumber: order.user.roomNumber,
      //       breakfast: order.breakfast,
      //       lunch: order.lunch,
      //       diner: order.diner,
      //       isGuestMeal: order.isGuestMeal,
      //       guestBreakfastCount: order.guestBreakfastCount,
      //       guestLunchCount: order.guestLunchCount,
      //       guestDinnerCount: order.guestDinnerCount,
      //       totalBreakfast: order.breakfast
      //         ? order.guestBreakfastCount + 1
      //         : order.guestBreakfastCount,
      //       totalLunch: order.lunch
      //         ? order.guestLunchCount + 1
      //         : order.guestLunchCount,
      //       totalDinner: order.dinner
      //         ? order.guestDinnerCount + 1
      //         : order.guestDinnerCount,
      //     });
      //   });
      rooms.forEach((room) => {
        let b = 0,
          l = 0,
          d = 0;
        orders
          .filter(
            (order) => order.user.floor == i && order.user.roomNumber == room
          )
          .forEach((order) => {
            order.breakfast ? (b += 1) : null;
            order.isGuestMeal ? (b += order.guestBreakfastCount) : null;
            order.lunch ? (l += 1) : null;
            order.isGuestMeal ? (l += order.guestLunchCount) : null;
            order.dinner ? (d += 1) : null;
            order.isGuestMeal ? (d += order.guestDinnerCount) : null;
          });
        if (b > 0 || l > 0 || d > 0) {
          ordersArray.push({
            roomNumber: room,
            totalBreakfast: b,
            totalLunch: l,
            totalDinner: d,
          });
        }
      });

      ordersArray.sort(compareRoomNumbers);
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
  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <div className="relative">
          <p className="text-center text-xl text-yellow-500 pb-4 font-semibold overflow-y-scroll">
            Floor Meal Analyzation
          </p>
          <FaTimes
            className="absolute top-2 right-2 text-yellow-500 text-xl cursor-pointer"
            onClick={closeModal}
          />
          <div className="space-y-1">
            {floorAnalysingData.map((d, i) => (
              <>
                <div
                  className="bg-stone-700 px-6 py-2 rounded-md flex items-center justify-center gap-5"
                  key={i}
                >
                  <p className="w-[110px]">
                    <span className="text-yellow-500 bg-stone-800 h-6 w-6 rounded-full inline-flex items-center justify-center mr-2">
                      {d.floor + 1}
                    </span>
                    {d.floor == 0 ? "G" : d.floor}
                    <sup>th</sup> Floor
                  </p>
                  <p className="w-[100px]">Breakfast: {d.totalBreakfast}</p>
                  <p className="w-[100px]">Lunch: {d.totalLunch}</p>
                  <p className="w-[100px]">Dinner: {d.totalDinner}</p>
                  <p className="w-[100px]">Total: {d.totalMeal}</p>
                </div>
                {d.orders.length > 0 && (
                  <div className="grid grid-cols-5 gap-3 border rounded-md p-2">
                    {d.orders.map((r, j) => (
                      <>
                        {(r.totalBreakfast == 0 &&
                          r.totalLunch == 0 &&
                          r.totalDinner == 0) || (
                          <table className="border" key={j}>
                            <thead>
                              <tr>
                                <th className="border text-sm font-extralight">
                                  Room
                                </th>
                                <th className="border text-sm font-extralight">
                                  Breakfast
                                </th>
                                <th className="border text-sm font-extralight">
                                  Lunch
                                </th>
                                <th className="border text-sm font-extralight">
                                  Dinner
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="border text-center">
                                  {r.roomNumber.split("")[0].toUpperCase() +
                                    "_" +
                                    r.roomNumber.split("")[1]}
                                </td>
                                <td className="border text-center">
                                  {r.totalBreakfast}
                                </td>
                                <td className="border text-center">
                                  {r.totalLunch}
                                </td>
                                <td className="border text-center">
                                  {r.totalDinner}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        )}
                      </>
                    ))}
                  </div>
                )}
              </>
            ))}
          </div>
        </div>
      </Modal>
      <div className="mb-20 max-h-screen">
        <p className="text-center font-semibold text-2xl">Order Status</p>
        {/* Order - Today  */}
        <div className="mt-10 bg-yellow-500 text-stone-800 p-4 rounded-md font-semibold text-lg flex items-center justify-between">
          <p className="w-[220px]">Today - {todayDateString}</p>
          <p className="">Breakfast - {breakfastOfToday}</p>
          <p className="">Lunch - {lunchOfToday}</p>
          <p className="">Dinner - {dinnerOfToday}</p>
          <p className="">
            Total - {breakfastOfToday + lunchOfToday + dinnerOfToday}
          </p>
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
              <p className={`${order.isGuestMeal ? "text-blue-500" : ""}`}>
                {order.user.username}
              </p>
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
          <p className="">
            Total - {breakfastOfTomorrow + lunchOfTomorrow + dinnerOfTomorrow}
          </p>
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
              <p className={`${order.isGuestMeal ? "text-blue-500" : ""}`}>
                {order.user.username}
              </p>
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
          <p className="">
            Total -{" "}
            {breakfastOfYesterday + lunchOfYesterday + dinnerOfYesterday}
          </p>
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
              <p className={`${order.isGuestMeal ? "text-blue-500" : ""}`}>
                {order.user.username}
              </p>
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
