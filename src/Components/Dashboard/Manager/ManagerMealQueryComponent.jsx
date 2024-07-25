"use client";

import PreLoader from "@/Components/PreLoader/PreLoader";
import Receipt from "@/Components/Receipt/Receipt";
import { AuthContext } from "@/providers/ContextProvider";
import { customStylesForReactSelect } from "@/utils/reactSelectCustomStyle";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import Select from "react-select";
import { Tooltip } from "react-tooltip";

const ManagerMealQueryComponent = () => {
  const { user } = useContext(AuthContext);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [managerAmount, setManagerAmount] = useState(null);

  //! Current Year in Bangladesh
  const currentDateBangladesh = new Date();
  currentDateBangladesh.setUTCHours(currentDateBangladesh.getUTCHours() + 6);
  const currentYearBangladesh = currentDateBangladesh.getFullYear();

  const { data: myClients } = useQuery({
    queryKey: ["myClients", "userQuery", user?._id],
    queryFn: async ({ queryKey }) => {
      const { data } = await axios.get(
        `/api/clients/getclients?id=${queryKey[2]}&onlyApproved=1&clientName=`
      );
      if (data.success) {
        const actualData = data.clients;
        const requiredData = actualData.map((client) => {
          return {
            value: client._id,
            label: client.username,
          };
        });
        return requiredData;
      }
    },
    enabled: user?._id && user.role == "manager" ? true : false,
  });
  //! Search
  const searchUserQuery = async (e) => {
    e.preventDefault();
    const clientId = e.target.clients.value;
    const month = e.target.month.value;
    const year = e.target.year.value;
    if (!clientId || !month || !year) {
      toast.error("Please select all fields!");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post("/api/orders/getorders", {
        userId: clientId,
        month,
        year,
      });
      setResult({ orders: data.orders, bill: data.bill });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong, Try again!");
    } finally {
      setLoading(false);
    }
  };
  if (!myClients || !user) return <PreLoader />;
  if (user?.success == false) return route.push("/signin");
  if (user.role != "manager") {
    return route.push("/");
  }
  return (
    <div className="min-h-full p-10 px-2 bg-dashboard text-slate-100">
      <p className="text-center font-semibold text-2xl dark:text-white">
        Meal Query
      </p>
      <form
        onSubmit={searchUserQuery}
        className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-1 my-14"
      >
        <div className="flex items-center gap-4">
          <p className="text-sky-500 font-semibold">Select User : </p>
          <Select
            name="clients"
            className="w-[200px] text-dashboard outline-none"
            options={myClients}
            styles={customStylesForReactSelect}
          />
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sky-500 font-semibold">Select Month : </p>
          <select
            name="month"
            className="px-5 py-2 rounded-md dark:bg-stone-700 cursor-pointer dark:text-white bg-stone-300 outline-none"
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
            className="px-5 py-2 rounded-md dark:bg-stone-700 cursor-pointer dark:text-white bg-stone-300 outline-none"
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
      <div className="flex justify-center py-10">
        {/* Search Result  */}
        <div className="md:w-1/2">
          <p className="text-center text-xl font-semibold border border-sky-500 rounded-sm px-4 py-2 relative dark:text-white">
            {result == null && (
              <p className="py-3 dark:text-white">
                <span className="text-sky-500 font-bold text-2xl">S</span>
                earch to get result
              </p>
            )}
            {result && result.orders.length == 0 && (
              <p className="py-3 dark:text-white">
                No <span className="text-sky-500 font-bold text-2xl">R</span>
                esult found
              </p>
            )}
            {result && result.orders.length > 0 && result.orders[0].month}
          </p>
          <div className="mt-6 flex items-center justify-center flex-wrap gap-4">
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
                className={`relative w-16 h-16 rounded-xl border-sky-500 border dark:text-white font-semibold flex items-center justify-center ${
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
      {result && result?.bill && (
        <div className=" border-2 flex justify-center py-10 my-10 dark:text-white">
          <div className="md:w-1/2">
            <p className="text-center text-xl font-semibold border border-sky-500 rounded-xl px-4 py-2 relative">
              Bill Details
            </p>
            <input
              placeholder="Enter Amount"
              onChange={(e) => setManagerAmount(parseInt(e.target.value))}
              value={managerAmount || managerAmount == 0 ? managerAmount : ""}
              className="text-sm w-[200px] mx-auto block my-3 px-5 py-2 outline-none rounded-full dark:bg-stone-800 bg-stone-300"
              type="number"
            />
            <Receipt
              key={result.bill._id}
              id={result.bill._id}
              // userName={bill.userName}
              month={result.bill.month}
              year={result.bill.year}
              totalBillInBDT={result.bill.totalBillInBDT}
              paidBillInBDT={result.bill.paidBillInBDT}
              totalBreakfast={result.bill.totalBreakfast}
              totalLunch={result.bill.totalLunch}
              totalDinner={result.bill.totalDinner}
              status={result.bill.status}
              managerAmount={managerAmount}
              setManagerAmount={setManagerAmount}
              charges={result.bill?.charges}
              isManageable={true}
              isRentPaid={result.bill.isRentPaid}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerMealQueryComponent;
