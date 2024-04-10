"use client";

import PreLoader from "@/Components/PreLoader/PreLoader";
import { AuthContext } from "@/providers/ContextProvider";
import { convertCamelCaseToCapitalized } from "@/utils/camelToCapitalize";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { FaPlus } from "react-icons/fa";

const BillQuery = () => {
  const { user } = useContext(AuthContext);
  const [result, setResult] = useState(null);
  const [searching, setSearching] = useState(false);
  const [managerAmount, setManagerAmount] = useState(null);
  const [isMoneyAdding, setIsMoneyAdding] = useState({ id: "", state: false });

  //! Current Year in Bangladesh
  const currentDateBangladesh = new Date();
  currentDateBangladesh.setUTCHours(currentDateBangladesh.getUTCHours() + 6);
  const currentYearBangladesh = currentDateBangladesh.getFullYear();

  const { data: myClients } = useQuery({
    queryKey: ["myClients", "BillQuery", user?._id],
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
  const searchBillQuery = async (e) => {
    e.preventDefault();
    setSearching(true);
    const clientId = e.target.clients.value;
    const month = e.target.month.value;
    const year = e.target.year.value;
    if (!clientId) {
      toast.error("Please select all fields!");
      return;
    }
    const { data } = await axios.get(
      `/api/bills/getbills?userId=${clientId}&month=${month}&year=${year}`
    );
    if (data.success) setResult(data.bills);
    else setResult(null);
    setSearching(false);
  };
  if (!myClients) return <PreLoader />;
  return (
    <div className="min-h-screen p-10 dark:bg-stone-900">
      <p className="text-center font-semibold text-2xl dark:text-white">
        Bill Query
      </p>
      <form
        onSubmit={searchBillQuery}
        className="flex items-center justify-center gap-4 my-6"
      >
        <p className="text-sky-500 font-semibold">Select User : </p>
        <select
          name="clients"
          className="px-5 py-2 rounded-md dark:bg-stone-700 cursor-pointer dark:text-white bg-stone-300"
        >
          <option value="">Select Client</option>
          {myClients.map((client) => (
            <option value={client._id} key={client._id}>
              {client.username}
            </option>
          ))}
        </select>
        <p className="text-sky-500 font-semibold">Select Month : </p>
        <select
          name="month"
          className="px-5 py-2 rounded-md dark:bg-stone-700 cursor-pointer dark:text-white bg-stone-300"
        >
          <option value="">None</option>
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
        <p className="text-sky-500 font-semibold">Select Year : </p>
        <select
          name="year"
          className="px-5 py-2 rounded-md dark:bg-stone-700 cursor-pointer dark:text-white bg-stone-300"
        >
          <option value="">None</option>
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
          className="bg-sky-500 px-4 py-2 rounded-md duration-300 font-semibold text-white active:scale-90 flex items-center gap-3"
        >
          Search {searching && <CgSpinner className="text-lg animate-spin" />}
        </button>
      </form>
      {result == null && (
        <p className="text-center text-xl font-semibold border border-sky-500 rounded-xl px-4 py-2 w-1/2 mx-auto relative dark:text-white">
          <p className="py-3 dark:text-white">
            <span className="text-sky-500 font-bold text-2xl">S</span>
            earch to get result
          </p>{" "}
        </p>
      )}
      {result && result.length == 0 && (
        <p className="text-center text-xl font-semibold border border-sky-500 rounded-xl px-4 py-2 w-1/2 mx-auto relative dark:text-white">
          <p className="py-3 dark:text-white">
            No <span className="text-sky-500 font-bold text-2xl">R</span>
            esult found
          </p>{" "}
        </p>
      )}
      <div className="">
        <div className="text-center text-xl font-semibold border border-sky-500 px-4 py-2 relative dark:text-white mt-4">
          {result && result.length > 0 && (
            <input
              placeholder="Enter Amount"
              onChange={(e) => setManagerAmount(parseInt(e.target.value))}
              value={managerAmount || managerAmount == 0 ? managerAmount : ""}
              className="text-sm w-[200px] px-5 py-2 outline-none rounded-full dark:bg-stone-800 bg-stone-300 absolute top-1/2 -translate-y-1/2 left-3"
              type="number"
            />
          )}
          Bill Details
        </div>
        <div className="grid grid-cols-3 gap-4">
          {result &&
            result.length > 0 &&
            result.map((bill) => (
              <div
                key={bill._id}
                className="border border-blue-500 px-4 py-4 my-4 dark:text-white"
              >
                <p className="font-semibold text-lg mb-4 bg-blue-500 text-white px-10 py-1 rounded-full w-max mx-auto">
                  {bill.month}
                </p>
                <div className="py-3 space-y-3 select-none">
                  <p>Year: {bill.year}</p>
                  <p>Total Brakefast: {bill.totalBreakfast}</p>
                  <p>Total Lunch: {bill.totalLunch}</p>
                  <p>Total Dinner: {bill.totalDinner}</p>
                  <p>
                    Total Amount:{" "}
                    <span className="bg-sky-500 font-semibold px-3 py-1 rounded-md ml-3">
                      {bill.totalBillInBDT} BDT
                    </span>
                  </p>
                  <div className="flex items-center gap-2">
                    <p>Paid Amount:</p>{" "}
                    <div className="flex items-center gap-5">
                      <span className="bg-sky-500 font-semibold px-3 py-1 rounded-md ml-3">
                        {bill.paidBillInBDT} BDT
                      </span>
                      {isMoneyAdding.state && isMoneyAdding.id == bill._id ? (
                        <CgSpinner className="text-xl text-blue-500 cursor-pointer animate-spin" />
                      ) : (
                        <FaPlus
                          onClick={async () => {
                            if (managerAmount != null && managerAmount >= 0) {
                              setIsMoneyAdding({ id: bill._id, state: true });
                              await axios.patch("/api/bills/getbills", {
                                billId: bill._id,
                                amount: managerAmount,
                              });
                              // await managerCalanderDataRefetch();

                              setManagerAmount(null);
                              setIsMoneyAdding({ id: "", state: false });
                              toast.success("Amount updated");
                            } else {
                              toast.error("Please enter amount");
                            }
                          }}
                          className="text-xl text-blue-500 cursor-pointer duration-300 active:scale-90"
                        />
                      )}
                    </div>
                  </div>
                  <p>
                    Status:{" "}
                    <span
                      className={`${
                        bill?.status == "calculated"
                          ? "bg-green-500"
                          : bill?.status == "initiated"
                          ? "bg-orange-500"
                          : "bg-blue-500"
                      }  font-semibold px-3 py-1 rounded-md ml-3`}
                    >
                      {convertCamelCaseToCapitalized(bill?.status)}
                    </span>
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default BillQuery;
