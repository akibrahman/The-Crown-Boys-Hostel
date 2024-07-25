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
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import Select from "react-select";

const ManagerBillQueryComponent = () => {
  const { user } = useContext(AuthContext);
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
  const currentMonthBangladesh = currentDateBangladesh.getMonth();

  const { data: myClients } = useQuery({
    queryKey: ["myClients", "BillQuery", user?._id],
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
    enabled: user?._id ? true : false,
  });

  // Tab Menu
  const [activeTab, setActiveTab] = useState({
    tab: "Month Wise",
    left: "31%",
    width: "120px",
  });
  const tabs = [
    { tab: "User Wise", left: "4%", width: "95px" },
    { tab: "Month Wise", left: "31%", width: "110px" },
    { tab: "Special Query", left: "62%", width: "125px" },
  ];

  if (!myClients) return <PreLoader />;

  return (
    <>
      {/* <div
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
      </div> */}
      <div className="min-h-full p-5 bg-dashboard text-slate-100">
        <p className="text-center font-semibold text-xl dark:text-white">
          Bill Query
        </p>
        {/* Tab  */}
        <div
          className={`relative flex justify-center items-center gap-8 bg-[#44403C] w-max mx-auto px-7 py-2 rounded-full mt-4 z-10 select-none`}
        >
          <div
            style={{ left: activeTab.left, width: activeTab.width }}
            className={`absolute top-0 transition-all duration-300 h-full bg-dashboard rounded border border-[#44403C] z-20`}
          ></div>
          {tabs.map((tab, index) => (
            <div
              onClick={() => setActiveTab(tab)}
              key={index}
              className="z-30 cursor-pointer text-sm"
            >
              {tab.tab}
            </div>
          ))}
        </div>
        {/* Tab  */}
        {activeTab.tab == "User Wise" && (
          <UserWise
            monthOrder={monthOrder}
            currentYearBangladesh={currentYearBangladesh}
            myClients={myClients}
          />
        )}
        {activeTab.tab == "Month Wise" && (
          <MonthWise
            monthOrder={monthOrder}
            currentYearBangladesh={currentYearBangladesh}
            currentMonthBangladesh={currentMonthBangladesh}
            myClients={myClients}
          />
        )}
      </div>
    </>
  );
};

const UserWise = ({ monthOrder, currentYearBangladesh, myClients }) => {
  const [result, setResult] = useState(null);
  const [searching, setSearching] = useState(false);
  const [managerAmount, setManagerAmount] = useState(null);

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

  return (
    <>
      <form
        onSubmit={searchBillQuery}
        className="flex flex-col md:flex-row items-center justify-center gap-4 my-6"
      >
        <div className="flex items-center gap-1">
          <p className="text-sky-500 font-semibold">Select User : </p>
          <Select
            name="clients"
            className="w-[200px]"
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
                  userName={bill.userName}
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
                  charges={bill?.charges}
                  isManageable={true}
                  isRentPaid={bill.isRentPaid}
                />
              ))}
        </div>
      </div>
    </>
  );
};

const MonthWise = ({
  monthOrder,
  currentYearBangladesh,
  currentMonthBangladesh,
  myClients,
}) => {
  const [month, setMonth] = useState(monthOrder[currentMonthBangladesh]);
  const [year, setYear] = useState(currentYearBangladesh);
  const [name, setName] = useState("");

  // const [result, setResult] = useState(null);
  const [managerAmount, setManagerAmount] = useState(null);

  const { data: result, refetch } = useQuery({
    queryKey: ["month-wise-bill", "Mmanager-only", month, year, name],
    queryFn: async ({ queryKey }) => {
      try {
        const { data } = await axios.get(
          `/api/bills/getbills2?month=${queryKey[2]}&year=${parseInt(
            queryKey[3]
          )}&name=${queryKey[4]}`
        );
        if (data.success) return data.bills;
        // else return null;
      } catch (error) {
        console.log(error);
        toast.error("Server error, Try again");
        // return null;
      }
    },
  });

  return (
    <div className="">
      <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-5 mt-4">
        <div className="flex items-center gap-4">
          <p className="text-sky-500 font-semibold">Select Month : </p>
          <select
            name="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
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
            value={year}
            onChange={(e) => setYear(e.target.value)}
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
        <input
          type="text"
          name=""
          id=""
          placeholder="Search by Name"
          className="px-5 py-2 rounded-md dark:bg-stone-700 cursor-pointer dark:text-white bg-stone-300 outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="">
        <div className="border border-sky-500 px-4 py-2 relative dark:text-white mt-4 flex items-center justify-center gap-1 md:gap-4">
          <p className="text-center text-xs md:text-xl font-semibold">
            Bill Details
          </p>
          {result && result.length > 0 && (
            <input
              placeholder="Enter Amount"
              onChange={(e) => setManagerAmount(parseInt(e.target.value))}
              value={managerAmount || managerAmount == 0 ? managerAmount : ""}
              className="text-sm w-[200px] px-5 py-2 outline-none rounded-full dark:bg-stone-800 bg-stone-300"
              type="number"
            />
          )}
          <p className="text-center text-xs md:text-xl font-semibold flex items-center justify-center gap-3">
            Count:
            {result ? (
              result.length
            ) : (
              <CgSpinner className="text-xl text-white animate-spin" />
            )}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 py-5">
          {result &&
            result.length > 0 &&
            result.map((bill) => (
              <Receipt
                key={bill._id}
                id={bill._id}
                userName={bill?.user?.username}
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
                charges={bill?.charges}
                isManageable={true}
                isRentPaid={bill.isRentPaid}
                refetch={refetch}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default ManagerBillQueryComponent;
