import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { CgSpinner } from 'react-icons/cg'
import { Tooltip } from 'react-tooltip';

const MealHistoryComponent = ({user}) => {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    //! Current Year in Bangladesh
  const currentDateBangladesh = new Date();
  currentDateBangladesh.setUTCHours(currentDateBangladesh.getUTCHours() + 6);
  const currentYearBangladesh = currentDateBangladesh.getFullYear();

    const searchUserQuery = async (e) => {
        e.preventDefault();
        const month = e.target.month.value;
        const year = e.target.year.value;
        if (!month || !year) {
          toast.error("Please select all fields!");
          return;
        }
        setLoading(true);
        try {
          const { data } = await axios.post("/api/orders/getorders", {
            userId: user._id,
            month,
            year,
          });
          setResult({ orders: data.orders});
        } catch (error) {
          console.log(error);
          toast.error("Something went wrong, Try again!");
        } finally {
          setLoading(false);
        }
      };
  return (
    <div>
       <p className="text-center font-semibold text-2xl dark:text-white">
        User Query
      </p>
      <form
        onSubmit={searchUserQuery}
        className="flex flex-col md:flex-row items-center justify-center gap-4 my-10 mt-5"
      >
        <div className="flex items-center gap-4">
          <p className="text-sky-500 font-semibold">Select Month : </p>
          <select
            name="month"
            className="px-5 py-2 rounded-md bg-[#1F2937] cursor-pointer text-white outline-none"
          >
            <option value="">Select Month</option>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sky-500 font-semibold">Select Year : </p>
          <select
            name="year"
            className="px-5 py-2 rounded-md bg-[#1F2937] cursor-pointer text-white outline-none"
          >
            <option value="">Select Year</option>
            <option value={currentYearBangladesh - 1}>
              {currentYearBangladesh - 1}
            </option>
            <option value={currentYearBangladesh}>
              {currentYearBangladesh}
            </option>
            <option value={currentYearBangladesh + 1}>
              {currentYearBangladesh + 1}
            </option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-sky-500 px-4 py-2 rounded-md duration-300 text-white font-semibold active:scale-90 flex items-center gap-1"
        >
          Search {loading && <CgSpinner className="animate-spin text-xl" />}
        </button>
      </form>
      {/* Search Result  */}
      <div className="">
          <p className="text-center text-xl font-semibold border border-sky-500 rounded-sm px-4 py-2 relative text-[#1F2937]">
            {result == null && (
              <p className="py-3 text-[#1F2937]">
                <span className="text-sky-500 font-bold text-2xl">S</span>
                earch to get result
              </p>
            )}
            {result && result.orders.length == 0 && (
              <p className="py-3 text-[#1F2937]">
                No <span className="text-sky-500 font-bold text-2xl">R</span>
                esult found
              </p>
            )}
            {result && result.orders.length > 0 && result.orders[0].month}
          </p>
          <div className="mt-6 flex items-center justify-center flex-wrap gap-4 px-20 mb-10">
            <Tooltip className="z-50" id="userQuery-tooltip" />
            {result?.orders?.map((order) => (
              <div
                data-tooltip-id="userQuery-tooltip"
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
                className={`relative w-16 h-16 rounded-xl border-sky-500 border text-[#1F2937] font-semibold flex items-center justify-center ${
                  order.isGuestMeal && "shadow-lg shadow-sky-500"
                }`}
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
    </div>
  )
}

export default MealHistoryComponent
