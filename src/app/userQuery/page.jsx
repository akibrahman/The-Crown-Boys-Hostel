"use client";

import { AuthContext } from "@/providers/ContextProvider";
import { convertCamelCaseToCapitalized } from "@/utils/camelToCapitalize";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useState } from "react";
import toast from "react-hot-toast";

const UserQuery = () => {
  const { user } = useContext(AuthContext);
  const [result, setResult] = useState(null);

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
    console.log(month, year);
    const { data } = await axios.post("/api/orders/getorders", {
      userId: clientId,
      month,
      year,
    });
    console.log(data);
    setResult({ orders: data.orders, bill: data.bill });
  };
  if (!myClients) return <p>Loading</p>;
  return (
    <div className="min-h-screen">
      <p className="text-center font-semibold text-2xl">User Query</p>
      <form
        onSubmit={searchUserQuery}
        className="flex items-center justify-center gap-4 my-14"
      >
        <p className="text-yellow-500 font-semibold">Select User : </p>
        <select
          name="clients"
          className="px-5 py-2 rounded-md bg-stone-700 cursor-pointer"
        >
          <option value="">Select Client</option>
          {myClients.map((client) => (
            <option value={client._id} key={client._id}>
              {client.username}
            </option>
          ))}
        </select>
        <p className="text-yellow-500 font-semibold">Select Month : </p>
        <select
          name="month"
          className="px-5 py-2 rounded-md bg-stone-700 cursor-pointer"
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
        <p className="text-yellow-500 font-semibold">Select Year : </p>
        <select
          name="year"
          className="px-5 py-2 rounded-md bg-stone-700 cursor-pointer"
        >
          <option value="">Select Year</option>
          <option value={currentYearBangladesh - 1}>
            {currentYearBangladesh - 1}
          </option>
          <option value={currentYearBangladesh}>{currentYearBangladesh}</option>
          <option value={currentYearBangladesh + 1}>
            {currentYearBangladesh + 1}
          </option>
        </select>
        <button
          type="submit"
          className="bg-yellow-500 px-4 py-2 rounded-md duration-300 font-semibold text-stone-800 active:scale-90"
        >
          Search
        </button>
      </form>
      <div className="border-2 flex justify-center py-10">
        {/* Search Result  */}
        <div className="w-1/2">
          <p className="text-center text-xl font-semibold border border-yellow-500 rounded-xl px-4 py-2 relative">
            {result == null && (
              <p className="py-3">
                <span className="text-yellow-500 font-bold text-2xl">S</span>
                earch to get result
              </p>
            )}
            {result && result.orders.length == 0 && (
              <p className="py-3">
                No <span className="text-yellow-500 font-bold text-2xl">R</span>
                esult found
              </p>
            )}
            {result && result.orders.length > 0 && result.orders[0].month}
          </p>
          <div className="mt-6 flex items-center justify-center flex-wrap gap-4">
            {result?.orders?.map((order) => (
              <div
                key={order._id}
                className="relative w-16 h-16 rounded-xl bg-yellow-500 flex items-center justify-center"
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
        <div className="border-2 flex justify-center py-10 my-10">
          <div className="w-1/2">
            <p className="text-center text-xl font-semibold border border-yellow-500 rounded-xl px-4 py-2 relative">
              Bill Details
            </p>
            <div className="py-3 space-y-3 select-none">
              <p>Total Brakefast: {result.bill.totalBreakfast}</p>
              <p>Total Lunch: {result.bill.totalLunch}</p>
              <p>Total Dinner: {result.bill.totalDinner}</p>
              <p>
                Total Amount:{" "}
                <span className="bg-yellow-500 font-semibold px-3 py-1 rounded-md ml-3">
                  {result.bill.totalBillInBDT} BDT
                </span>
              </p>
              <p>
                Paid Amount:{" "}
                <span className="bg-yellow-500 font-semibold px-3 py-1 rounded-md ml-3">
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
