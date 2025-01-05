"use client";
import PreLoader from "@/Components/PreLoader/PreLoader";
import Receipt from "@/Components/Receipt/Receipt";
import { AuthContext } from "@/providers/ContextProvider";
import { customStylesForReactSelect } from "@/utils/reactSelectCustomStyle";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { FaTimes } from "react-icons/fa";
import Select from "react-select";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const ManagerBillQueryComponent = () => {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

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
    width: "110px",
  });
  const tabs = [
    { tab: "User Wise", left: "4%", width: "95px" },
    { tab: "Month Wise", left: "31%", width: "110px" },
    { tab: "Special Query", left: "62%", width: "125px" },
  ];

  useEffect(() => {
    if (!userId) return;
    setActiveTab({ tab: "User Wise", left: "4%", width: "95px" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  if (!myClients) return <PreLoader />;

  return (
    <>
      <div className="min-h-full p-2 md:p-5 bg-dashboard text-slate-100 relative">
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
            userId={userId}
            router={router}
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
        {activeTab.tab == "Special Query" && <SpecialQuery user={user} />}
      </div>
    </>
  );
};

const UserWise = ({
  monthOrder,
  currentYearBangladesh,
  myClients,
  userId,
  router,
}) => {
  const [result, setResult] = useState(null);
  const [searching, setSearching] = useState(false);
  const [managerAmount, setManagerAmount] = useState(null);

  useEffect(() => {
    if (!userId) return;
    setSearching(true);
    axios
      .get(`/api/bills/getbills?userId=${userId}`)
      .then(({ data }) => {
        if (data.success) setResult(data.bills);
        else setResult(null);
        setSearching(false);
      })
      .catch((err) => {
        setResult(null);
        setSearching(false);
        console.log("Bill Fetching Error:", err);
      })
      .finally(() => {
        const url = new URL(window.location.href);
        const baseUrl =
          url.origin + url.pathname + "?displayData=managerBillQuery";
        router.replace(baseUrl);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

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
        className="flex flex-col md:flex-row items-center justify-center gap-4 my-6 relative"
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
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 py-5">
          {result &&
            result.length > 0 &&
            result
              .sort((a, b) => {
                if (b.year !== a.year) {
                  return b.year - a.year;
                }
                return (
                  monthOrder.indexOf(b.month) - monthOrder.indexOf(a.month)
                );
              })
              .map((bill) => (
                <Receipt
                  key={bill._id}
                  id={bill._id}
                  userName={bill.userName}
                  month={bill.month}
                  year={bill.year}
                  totalBillInBDT={bill.totalBillInBDT}
                  paidBillInBDT={bill?.paidBillInBDT}
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
    <div className="relative">
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
                paidBillInBDT={bill?.paidBillInBDT}
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

const SpecialQuery = ({ user }) => {
  const [name, setName] = useState("");
  const [smsModal, setSmsModal] = useState([false, {}]);
  const [smsModalSms, setSmsModalSms] = useState("");

  const { data: dues, isLoading } = useQuery({
    queryKey: ["special-query-bill", "Mmanager-only", user?._id, name],
    queryFn: async ({ queryKey }) => {
      try {
        const { data } = await axios.get(
          `/api/bills/getspecialquerybills?managerId=${queryKey[2]}&name=${queryKey[3]}`
        );
        if (!data.success) throw new Error();
        return data.data;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
  });

  return (
    <>
      {smsModal[0] && (
        <div className="fixed z-[50000] top-0 left-0 w-full h-screen bg-[rgba(0,0,0,0.5)]">
          <motion.div
            initial={{ scale: 0.5, x: "-50%", y: "-50%", opacity: 0 }}
            whileInView={{ scale: 1, x: "-50%", y: "-50%", opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 10 }}
            className="absolute text-dashboard top-1/2 left-1/2 bg-white md:h-[80%] w-[95%] md:w-[60%] rounded-xl pb-5 md:pb-0 p-5"
          >
            <FaTimes
              className="text-2xl absolute top-1 right-2 text-slate-200 cursor-pointer duration-300 active:scale-90 bg-dashboard aspect-square rounded-full p-1"
              onClick={() => {
                setSmsModal([false, {}]);
                setSmsModalSms("");
              }}
            />
            <div className="flex items-center justify-center gap-10">
              <div className="mt-5 pl-3 py-1.5 border-l-4 border-dashboard font-semibold">
                <p> Name: {smsModal[1].name}</p>
                <p> E-Mail: {smsModal[1].email}</p>
                <p> Number: {smsModal[1].number}</p>
              </div>
              <Image
                src={
                  smsModal[1].photo == "/__"
                    ? "/images/no-user.png"
                    : smsModal[1].photo
                }
                width={60}
                height={60}
                alt={`Photo of ${smsModal[1].name}`}
                className="rounded-full h-20 w-20"
              />
            </div>
            <textarea
              className="w-full mt-5 border border-dashboard bg-dashboard text-white font-medium p-5 rounded-xl"
              rows="8"
              value={smsModalSms}
              onChange={(e) => {
                setSmsModalSms(e.target.value);
              }}
            ></textarea>
            <div className="flex items-center justify-center">
              <button
                onClick={async () => {
                  try {
                    const { data } = await axios.post("/api/sms", {
                      msg: smsModalSms,
                      receiver: [{ number: smsModal[1].number }],
                    });
                    if (!data.success) throw new Error("SMS Sent Error");
                    toast.success("SMS Sent Successfully");
                  } catch (error) {
                    console.log(error);
                    toast.error(
                      error?.message ||
                        error?.response?.data?.msg ||
                        "SMS Sent Error"
                    );
                  } finally {
                    setSmsModal([false, {}]);
                    setSmsModalSms("");
                  }
                }}
                className="px-10 py-1 bg-dashboard font-semibold text-white duration-300 active:scale-90 mt-3"
              >
                Send
              </button>
            </div>
          </motion.div>
        </div>
      )}
      <div className="relative mt-4">
        <p className="text-center font-semibold text-lg underline tracking-wider">
          Pending Due Users
        </p>
        <div className="flex items-center justify-center mt-3">
          <input
            type="text"
            placeholder="Search by Name"
            className="px-5 py-2 rounded-md dark:bg-stone-700 dark:text-white bg-stone-300 outline-none inline-block mx-auto"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        {!dues || isLoading ? (
          <div className="flex items-center justify-center gap-2 mt-6">
            <p>Loading Statements</p>
            <CgSpinner className="animate-spin text-xl text-white" />
          </div>
        ) : dues.length > 0 ? (
          <div className="mt-3 flex flex-col gap-2">
            {dues?.map((due, i) => (
              <div
                className="w-full px-4 py-2 border flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0"
                key={due._id}
              >
                <div className="flex items-center gap-2 md:gap-5">
                  <p>{i + 1}</p>
                  <Image
                    src={due.photo == "/__" ? "/images/no-user.png" : due.photo}
                    width={40}
                    height={40}
                    alt={`Photo of ${due.name}`}
                    className="rounded-full h-10 w-10"
                  />
                  <p className="w-[100px] md:w-[150px] overflow-x-hidden text-sm md:text-base">
                    {due.name}
                  </p>
                  <Link
                    target="_blank"
                    href={`/dashboard?displayData=managerBillQuery&userId=${due._id}`}
                  >
                    <button className="px-3 md:px-6 py-1 text-xs md:text-base rounded-full bg-blue-500 active:scale-90 duration-300 text-white">
                      Bills
                    </button>
                  </Link>
                  <button
                    onClick={async () => {
                      setSmsModalSms(
                        `Hi ${
                          due?.name
                        },\n\nThis is a reminder that you have outstanding dues with us. Please find the details below:\nOutstanding Amount:\n${
                          due?.amounts?.length > 1
                            ? `${due?.amounts.join(
                                " + "
                              )} = ${due?.amounts.reduce((a, c) => a + c, 0)}/-`
                            : `${due?.amounts?.[0]}/-`
                        }\n\nPlease check Dashboard > My Bills for more details.\n\nWe appreciate your timely attention to this.\n\nThank you,\nThe Crown Boys Hostel Management Team`
                      );
                      return setSmsModal([
                        true,
                        {
                          name: due.name,
                          number: due.number,
                          email: due.email,
                          photo: due.photo,
                          amounts: due.amounts,
                        },
                      ]);
                    }}
                    className="px-3 md:px-6 py-1 text-xs md:text-base rounded-full bg-purple-500 active:scale-90 duration-300 text-white"
                  >
                    SMS
                  </button>
                  <button
                    onClick={() => (window.location.href = `tel:${due.number}`)}
                    className="px-3 md:px-6 py-1 text-xs md:text-base rounded-full bg-green-500 active:scale-90 duration-300 text-white"
                  >
                    Call
                  </button>
                </div>
                <p>
                  {due.amounts.length > 1
                    ? `${due.amounts.join(" + ")} =${" "}
           ${due.amounts.reduce((a, c) => a + c, 0)}/-`
                    : `${due.amounts[0]}/-`}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center mt-6 text-red-500">No Statements Found</p>
        )}
      </div>
    </>
  );
};

export default ManagerBillQueryComponent;
