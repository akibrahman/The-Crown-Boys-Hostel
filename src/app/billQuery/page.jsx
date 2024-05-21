"use client";

import PreLoader from "@/Components/PreLoader/PreLoader";
import Receipt from "@/Components/Receipt/Receipt";
import { AuthContext } from "@/providers/ContextProvider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";

const BillQuery = () => {
  const { user } = useContext(AuthContext);
  const [result, setResult] = useState(null);
  const [searching, setSearching] = useState(false);
  const [managerAmount, setManagerAmount] = useState(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const monthOrder = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

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
      toast.error("Please select User!");
      setSearching(false);
      setResult(null);
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
    <>
      <div
        className={`h-[100vh] w-[90%] md:w-[40%] top-1/2 -translate-y-1/2 right-0 z-40 bg-stone-800 fixed duration-300 ${
          isSidebarOpen || "translate-x-full"
        }`}
      >
        <div
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`${
            isSidebarOpen ? "ide_bar_opener_close" : "ide_bar_opener_open"
          } -translate-x-full rounded-s-xl cursor-pointer w-[40px] h-[190px] bg-stone-800 absolute top-1/2 -translate-y-1/2 left-0 flex items-center justify-center`}
        >
          {isSidebarOpen ? (
            <MdArrowForwardIos className="text-stone-300 text-2xl ml-2" />
          ) : (
            <MdArrowBackIos className="text-stone-300 text-2xl ml-2" />
          )}
        </div>
      </div>
      <div className="min-h-screen p-10 dark:bg-gradient-to-r dark:from-primary dark:to-secondary">
        <p className="text-center font-semibold text-2xl dark:text-white">
          Bill Query
        </p>
        <form
          onSubmit={searchBillQuery}
          className="flex flex-col md:flex-row items-center justify-center gap-4 my-6"
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
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sky-500 font-semibold">Select Year : </p>
            <select
              name="year"
              className="px-5 py-2 rounded-md dark:bg-stone-700 cursor-pointer dark:text-white bg-stone-300 outline-none"
            >
              <option value="">None</option>
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
            className="bg-sky-500 px-4 py-2 rounded-md duration-300 font-semibold text-white active:scale-90 flex items-center gap-3"
          >
            Search {searching && <CgSpinner className="text-lg animate-spin" />}
          </button>
        </form>
        {result == null && (
          <p className="text-center text-xl font-semibold border border-sky-500 rounded-sm px-4 py-2 md:w-1/2 mx-auto relative dark:text-white">
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
          <div className="border border-sky-500 px-4 py-2 relative dark:text-white mt-4 flex items-center justify-center gap-4">
            <p className="text-center text-xl font-semibold">Bill Details</p>
            {result && result.length > 0 && (
              <input
                placeholder="Enter Amount"
                onChange={(e) => setManagerAmount(parseInt(e.target.value))}
                value={managerAmount || managerAmount == 0 ? managerAmount : ""}
                className="text-sm w-[200px] px-5 py-2 outline-none rounded-full dark:bg-stone-800 bg-stone-300"
                type="number"
              />
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 py-5">
            {result &&
              result.length > 0 &&
              result
                .sort(
                  (a, b) =>
                    monthOrder.indexOf(b.month) - monthOrder.indexOf(a.month)
                )
                .map((bill) => (
                  <Receipt
                    key={bill._id}
                    id={bill._id}
                    month={bill.month}
                    year={bill.year}
                    totalBillInBDT={bill.totalBillInBDT}
                    paidBillInBDT={bill.paidBillInBDT}
                    totalBreakfast={bill.totalBreakfast}
                    totalLunch={bill.totalLunch}
                    totalDinner={bill.totalDinner}
                    status={bill.status}
                    managerAmount={managerAmount}
                    setManagerAmount={setManagerAmount}
                  />
                ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BillQuery;
