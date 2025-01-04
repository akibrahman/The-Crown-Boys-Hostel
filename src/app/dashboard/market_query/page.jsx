"use client";

import PreLoader from "@/Components/PreLoader/PreLoader";
import { AuthContext } from "@/providers/ContextProvider";
import axios from "axios";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { FaTimes } from "react-icons/fa";
import { MdLocalGasStation } from "react-icons/md";
import { TbMoneybag } from "react-icons/tb";

const ManagerMarketQueryComponent = () => {
  const { user } = useContext(AuthContext);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  //! Current Year in Bangladesh
  const currentDateBangladesh = new Date();
  currentDateBangladesh.setUTCHours(currentDateBangladesh.getUTCHours() + 6);
  const currentYearBangladesh = currentDateBangladesh.getFullYear();
  //! Search
  const searchMarketQuery = async (e) => {
    e.preventDefault();
    const month = e.target.month.value;
    const year = e.target.year.value;
    if (!month || !year) {
      toast.error("Please select all fields!");
      return;
    }
    setLoading(true);
    try {
      const { data: data1 } = await axios.post("/api/markets/getmarkets", {
        managerId: user._id,
        month,
        year,
      });

      const { data: data2 } = await axios.get(
        `/api/managerbills?marketId=${data1?.market?._id}`
      );
      setResult({ markets: data1.market, bill: data2.managerBill });
      console.log({ markets: data1.market, bill: data2.managerBill });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong, Try again!");
    } finally {
      setLoading(false);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const openModal = (data) => {
    setIsModalOpen(true);
    setModalData(data);
  };
  const closeModal = async () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  if (!user) return <PreLoader />;
  return (
    <div className="relative bg-dashboard">
      {modalData && (
        <ModalComponent
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          modalData={modalData}
        />
      )}
      <div className="min-h-screen p-10 px-3 text-slate-100">
        <p className="text-center font-semibold text-2xl dark:text-white">
          Market Query
        </p>
        <form
          onSubmit={searchMarketQuery}
          className="flex flex-col md:flex-row items-center justify-center gap-4 my-14"
        >
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
          <div className="">
            <p className="text-center text-xl font-semibold border border-sky-500 rounded-sm px-4 py-2 relative dark:text-white">
              {result == null && (
                <p className="py-3 dark:text-white">
                  <span className="text-sky-500 font-bold text-2xl">S</span>
                  earch to get result
                </p>
              )}
              {result && (!result.markets || !result.bill) && (
                <p className="py-3 dark:text-white">
                  No <span className="text-sky-500 font-bold text-2xl">R</span>
                  esult found
                </p>
              )}
              {result && result.markets && result.bill && result.markets.month}
            </p>
            <div className="mt-6 flex items-center justify-center flex-wrap gap-4">
              {result &&
                result.markets &&
                result.bill &&
                result?.markets?.data?.map((mrkt) => (
                  // <div
                  //   key={mrkt._id}
                  //   className="relative w-[110px] h-20 rounded-md border-sky-500 border flex items-center justify-center flex-col"
                  // >
                  //   <span className="font-semibold bg-white text-sky-500 px-2 py-1 rounded-md mb-2 select-none">
                  //     {" "}
                  //     {mrkt.date.split("/")[1] +
                  //       "-" +
                  //       mrkt.date.split("/")[0] +
                  //       "-" +
                  //       mrkt.date.split("/")[2]}
                  //   </span>

                  //   <span className="select-none dark:text-white">
                  //     {mrkt.details.reduce((total, item) => {
                  //       return (
                  //         total +
                  //         Object.values(item).reduce(
                  //           (sum, value) => sum + value,
                  //           0
                  //         )
                  //       );
                  //     }, 0)}{" "}
                  //     /-
                  //   </span>
                  // </div>
                  <div
                    onClick={() => {
                      if (isModalOpen) return;
                      openModal(mrkt);
                    }}
                    key={mrkt._id}
                    className="relative w-[150px] h-20 rounded-md text-sky-500 flex items-center justify-center border-sky-500 border flex-col cursor-pointer duration-300 active:scale-90 hover:scale-110"
                  >
                    <div className="absolute top-1 right-1 flex flex-col items-center justify-center">
                      <TbMoneybag className="text-xl" />
                      <p className="font-light">
                        {mrkt.details.reduce((a, c) => {
                          let value = Object.keys(c)[0];
                          if (value.trim().toLowerCase() == "rice")
                            return a + 1;
                          else return a + 0;
                        }, 0)}
                      </p>
                    </div>
                    <div className="absolute top-1 left-1 flex flex-col items-center justify-center">
                      <MdLocalGasStation className="text-xl" />
                      <p className="font-light">
                        {mrkt.details.reduce((a, c) => {
                          let value = Object.keys(c)[0];
                          if (value.trim().toLowerCase() == "gas") return a + 1;
                          else return a + 0;
                        }, 0)}
                      </p>
                    </div>
                    <span className="font-semibold bg-white text-sky-500 px-2 py-1 rounded-md mb-2 select-none">
                      {" "}
                      {mrkt.date.split("/")[1] +
                        "-" +
                        mrkt.date.split("/")[0] +
                        "-" +
                        mrkt.date.split("/")[2]}
                    </span>

                    <span className="select-none text-white font-medium">
                      {mrkt.details.reduce((total, market) => {
                        let value = Object.values(market)[0];
                        return total + value;
                      }, 0)}{" "}
                      /-
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
        {result && result.markets && result.bill && result?.bill && (
          <div className="flex justify-center md:py-10 md:my-10 dark:text-white">
            <div className="md:w-1/2">
              <p className="text-center text-xl font-semibold border border-sky-500 rounded-xl px-4 py-2 relative">
                Details
              </p>
              <div className="py-3 space-y-3 select-none">
                {/* <p>Total Brakefast: {result.bill.totalBreakfast}</p>
              <p>Total Lunch: {result.bill.totalLunch}</p>
              <p>Total Dinner: {result.bill.totalDinner}</p> */}
                <p>
                  Total Merket Amount:{" "}
                  <span className="bg-sky-500 font-semibold px-3 py-1 rounded-md ml-3">
                    {result.bill.totalMarketAmountInBDT} BDT
                  </span>
                </p>
                <p>
                  Total Meal Count:{" "}
                  <span className="bg-sky-500 font-semibold px-3 py-1 rounded-md ml-3">
                    {result.bill.totalMeal}
                  </span>
                </p>
                <p>
                  Meal Rate:{" "}
                  <span className="bg-sky-500 font-semibold px-3 py-1 rounded-md ml-3">
                    {result.bill.mealRate}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerMarketQueryComponent;

const ModalComponent = ({ isModalOpen, closeModal, modalData }) => {
  return (
    <div
      className={`fixed z-40 bg-stone-100 rounded-md top-1/2 -translate-y-1/2 left-1/2 p-5 md:p-10 space-y-1 -translate-x-1/2 duration-300 transition-all overflow-y-scroll ${
        isModalOpen
          ? "h-96 w-[95%] md:w-[700px] opacity-100 pointer-events-auto"
          : "h-0 w-0 opacity-0 pointer-events-none"
      }`}
    >
      <FaTimes
        className="absolute top-6 right-6 cursor-pointer duration-300 active:scale-90 text-xl text-dashboard"
        onClick={closeModal}
      />
      <p>
        <span className="min-w-[50px] inline-block">ID:</span>{" "}
        <span className="font-medium text-dashboard">{modalData?._id}</span>
      </p>
      <p>
        <span className="min-w-[50px] inline-block">Date:</span>{" "}
        <span className="font-medium text-dashboard">{modalData?.date}</span>
      </p>
      <p className="underline text-center font-semibold text-lg my-4">
        Markets
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {modalData?.details?.map((d, i) => (
          <p
            key={i}
            className="flex flex-col md:flex-row items-center md:gap-4 border-2 p-3 rounded"
          >
            <p className="text-center md:text-left">{Object.keys(d)[0]} :</p>
            <p className="bg-dashboard px-5 py-2 rounded-full text-white">
              {d[Object.keys(d)[0]]} BDT
            </p>
          </p>
        ))}
      </div>
    </div>
  );
};
