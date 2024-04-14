"use client";

import PreLoader from "@/Components/PreLoader/PreLoader";
import { AuthContext } from "@/providers/ContextProvider";
import { convertCamelCaseToCapitalized } from "@/utils/camelToCapitalize";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";

const UserQuery = () => {
  const { user } = useContext(AuthContext);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  //! Current Year in Bangladesh
  const currentDateBangladesh = new Date();
  currentDateBangladesh.setUTCHours(currentDateBangladesh.getUTCHours() + 6);
  const currentYearBangladesh = currentDateBangladesh.getFullYear();

  const { data: myClients } = useQuery({
    queryKey: ["myClients", "userQuery", user?._id],
    queryFn: async ({ queryKey }) => {
      const { data } = await axios.get(
        `/api/clients/getclients?id=${queryKey[2]}&onlyApproved=1`
      );
      if (data.success) {
        return data.clients;
      }
    },
    enabled: user?._id ? true : false,
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
  if (!myClients) return <PreLoader />;
  return (
    <div className="min-h-screen p-10 dark:bg-stone-900">
      <p className="text-center font-semibold text-2xl dark:text-white">
        User Query
      </p>
      <form
        onSubmit={searchUserQuery}
        className="flex flex-col md:flex-row items-center justify-center gap-4 my-14"
      >
        <div className="flex items-center gap-4">
          <p className="text-sky-500 font-semibold">Select User : </p>
          <select
            name="clients"
            className="px-5 py-2 rounded-md dark:bg-stone-700 cursor-pointer dark:text-white bg-stone-300 outline-none"
          >
            <option value="">Select Client</option>
            {myClients.map((client) => (
              <option value={client._id} key={client._id}>
                {client.username}
              </option>
            ))}
          </select>
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
            {result?.orders?.map((order) => (
              <div
                key={order._id}
                className="relative w-16 h-16 rounded-xl border-sky-500 border dark:text-white font-semibold flex items-center justify-center"
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
        <div className="border-2 flex justify-center py-10 my-10 dark:text-white">
          <div className="w-1/2">
            <p className="text-center text-xl font-semibold border border-sky-500 rounded-xl px-4 py-2 relative">
              Bill Details
            </p>
            <div className="py-3 space-y-3 select-none">
              <p>Total Brakefast: {result.bill.totalBreakfast}</p>
              <p>Total Lunch: {result.bill.totalLunch}</p>
              <p>Total Dinner: {result.bill.totalDinner}</p>
              <p>
                Total Amount:{" "}
                <span className="bg-sky-500 font-semibold px-3 py-1 rounded-md ml-3">
                  {result.bill.totalBillInBDT} BDT
                </span>
              </p>
              <p>
                Paid Amount:{" "}
                <span className="bg-sky-500 font-semibold px-3 py-1 rounded-md ml-3">
                  {result.bill.paidBillInBDT} BDT
                </span>
              </p>
              <p>
                Status:{" "}
                <span
                  className={`${
                    result?.bill?.status == "calculated"
                      ? "bg-green-500"
                      : result?.bill?.status == "initiated"
                      ? "bg-orange-500"
                      : "bg-blue-500"
                  }  font-semibold px-3 py-1 rounded-md ml-3`}
                >
                  {convertCamelCaseToCapitalized(result?.bill?.status)}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserQuery;
