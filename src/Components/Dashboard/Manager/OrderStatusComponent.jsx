import React from "react";
import { Tooltip } from "react-tooltip";

const OrderStatusComponent = ({
  date,
  orders,
  openModal,
  floorAnalyzer,
  setPosPrintData,
  setShowPosPrint,
}) => {
  const breakfastCount =
    parseInt(orders?.filter((order) => order.breakfast == true).length) +
    parseInt(
      orders
        ?.filter(
          (order) => order.isGuestMeal == true && order.guestBreakfastCount > 0
        )
        .reduce(
          (accumulator, currentValue) =>
            accumulator + parseInt(currentValue.guestBreakfastCount),
          0
        )
    );
  const breakfastScannedCount = parseInt(
    orders?.filter(
      (order) =>
        (order.breakfast == true ||
          (order.isGuestMeal == true && order.guestBreakfastCount > 0)) &&
        order?.isBreakfastScanned &&
        order?.isBreakfastScanned == true
    ).length
  );
  const lunchCount =
    parseInt(orders?.filter((order) => order.lunch == true).length) +
    parseInt(
      orders
        ?.filter(
          (order) => order.isGuestMeal == true && order.guestLunchCount > 0
        )
        .reduce(
          (accumulator, currentValue) =>
            accumulator + parseInt(currentValue.guestLunchCount),
          0
        )
    );
  const lunchScannedCount = parseInt(
    orders?.filter(
      (order) =>
        (order.lunch == true ||
          (order.isGuestMeal == true && order.guestLunchCount > 0)) &&
        order?.isLunchScanned &&
        order?.isLunchScanned == true
    ).length
  );
  const dinnerCount =
    parseInt(orders?.filter((order) => order.dinner == true).length) +
    parseInt(
      orders
        ?.filter(
          (order) => order.isGuestMeal == true && order.guestDinnerCount > 0
        )
        .reduce(
          (accumulator, currentValue) =>
            accumulator + parseInt(currentValue.guestDinnerCount),
          0
        )
    );
  const dinnerScannedCount = parseInt(
    orders?.filter(
      (order) =>
        (order.dinner == true ||
          (order.isGuestMeal == true && order.guestDinnerCount > 0)) &&
        order?.isDinnerScanned &&
        order?.isDinnerScanned == true
    ).length
  );
  return (
    <>
      <div className="mt-4 md:mt-6 bg-dark-black text-white p-4 rounded-md font-semibold text-sm md:text-base flex flex-col md:flex-row gap-2 md:gap-0 items-center justify-between">
        <p className="md:w-[220px]">Date - {date}</p>
        <div className="flex flex-col md:flex-row items-center md:justify-evenly gap-2 md:gap-0 w-full">
          <div className="">
            <p className="">Breakfast : {breakfastCount}</p>
            <p className="">Scanned : {breakfastScannedCount}</p>
          </div>
          <div className="">
            <p className="">Lunch : {lunchCount}</p>
            <p className="">Scanned : {lunchScannedCount}</p>
          </div>
          <div className="">
            <p className="">Dinner : {dinnerCount}</p>
            <p className="">Scanned : {dinnerScannedCount}</p>
          </div>
          <p className="">
            Total : {breakfastCount + lunchCount + dinnerCount}
          </p>
        </div>
        <div className="flex items-center justify-center gap-2">
          {orders && (
            <button
              onClick={() => {
                openModal();
                floorAnalyzer(orders);
              }}
              className="bg-dark text-white px-4 py-1 text-sm rounded-full active:scale-90 duration-300 hover:scale-x-110"
            >
              Floor
            </button>
          )}
          <button
            onClick={() => {
              setPosPrintData(orders);
              setShowPosPrint(true);
            }}
            className="bg-dark text-white px-4 py-1 text-sm rounded-full active:scale-90 duration-300 hover:scale-x-110"
          >
            POS
          </button>
        </div>
      </div>
      {/* Order Details  */}
      <div className="text-sm bg-dark-black px-5 text-white py-2 my-2 rounded-md grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center">
        {orders?.map((order) => (
          <div className="flex items-center gap-3 md:gap-8" key={order._id}>
            <Tooltip className="z-50" id="orderstatustomorrow" />
            <p
              data-tooltip-id="orderstatustomorrow"
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
              className={`${
                order.isGuestMeal ? "text-blue-500" : ""
              } text-sm md:text-base w-max`}
            >
              {order.user.username}
            </p>
            <div className="flex items-center gap-2">
              <span
                className={`relative w-5 h-5 block border-2 ${
                  order.breakfast
                    ? "bg-green-500 border-green-500"
                    : "bg-red-500 border-red-500"
                }`}
                style={{
                  boxShadow: `inset 0 0 0 2px ${
                    (order.breakfast ||
                      (order.isGuestMeal && order.guestBreakfastCount > 0)) &&
                    order?.isBreakfastScanned &&
                    order?.isBreakfastScanned == true
                      ? "#121723"
                      : order.breakfast
                      ? "#22C55E"
                      : "#EF4444"
                  }`,
                }}
              ></span>
              <span
                className={`relative w-5 h-5 block border-2 ${
                  order.lunch
                    ? "bg-green-500 border-green-500"
                    : "bg-red-500 border-red-500"
                }`}
                style={{
                  boxShadow: `inset 0 0 0 2px ${
                    (order.lunch ||
                      (order.isGuestMeal && order.guestLunchCount > 0)) &&
                    order?.isLunchScanned &&
                    order?.isLunchScanned == true
                      ? "#121723"
                      : order.lunch
                      ? "#22C55E"
                      : "#EF4444"
                  }`,
                }}
              ></span>
              <span
                className={`relative w-5 h-5 block border-2 ${
                  order.dinner
                    ? "bg-green-500 border-green-500"
                    : "bg-red-500 border-red-500"
                }`}
                style={{
                  boxShadow: `inset 0 0 0 2px ${
                    (order.dinner ||
                      (order.isGuestMeal && order.guestDinnerCount > 0)) &&
                    order?.isDinnerScanned &&
                    order?.isDinnerScanned == true
                      ? "#121723"
                      : order.dinner
                      ? "#22C55E"
                      : "#EF4444"
                  }`,
                }}
              ></span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default OrderStatusComponent;
