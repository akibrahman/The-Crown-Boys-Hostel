import { Tooltip } from "react-tooltip";

const CalenderClient = ({
  user,
  depositeAmount,
  currentMonth,
  breakfastCount,
  lunchCount,
  dinnerCount,
  calanderData,
}) => {
  return (
    user.role == "client" &&
    user.isVerified &&
    user.isClientVerified && (
      <div className="col-span-1 md:col-span-2 px-6 pb-8 mt-10">
        <p className="text-center text-xl font-semibold border border-sky-500 rounded-xl px-4 py-2 relative flex flex-col md:flex-row gap-3 md:gap-0+6 items-center justify-between">
          <span className="text-sm text-sky-500">
            Deposite Amount - {depositeAmount} BDT
          </span>
          <span> {currentMonth}</span>
          <span className="text-sm text-sky-500">
            Approx. Bill -{" "}
            {breakfastCount * 30 + lunchCount * 60 + dinnerCount * 60 + 500} BDT
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
    )
  );
};

export default CalenderClient;
