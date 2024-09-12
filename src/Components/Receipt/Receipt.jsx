"use client";
import { convertCamelCaseToCapitalized } from "@/utils/camelToCapitalize";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { FaEye, FaTimes } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import { TiTick } from "react-icons/ti";
import { useBkash } from "react-bkash";
import { AuthContext } from "@/providers/ContextProvider";

const Receipt = ({
  id,
  totalBillInBDT = 20,
  status = "calculated",
  year = 2024,
  month = "May",
  totalBreakfast = 99,
  totalLunch = 97,
  totalDinner = 66,
  charges,
  userName,
  isManageable = false,
  refetch,
  isRentPaid,
}) => {
  const [isMoneyAdding, setIsMoneyAdding] = useState({
    id: "",
    state: false,
    method: "",
  });

  const route = useRouter();
  const { user } = useContext(AuthContext);

  const [isRPaid, setIsRPaid] = useState(isRentPaid);
  const [showTransactions, setShowTransactions] = useState(false);

  const {
    data: transactions,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["User Transactions", "Receipt", id],
    queryFn: async ({ queryKey }) => {
      const { data } = await axios.get(`/api/transaction?id=${queryKey[2]}`);
      if (data.success) {
        return data.transactions;
      } else {
        return [];
      }
    },
    enabled: id ? true : false,
  });

  const rentStatusChange = async () => {
    setIsMoneyAdding({
      id,
      state: true,
      method: "rent",
    });
    setIsRPaid(!isRPaid);
    await axios.patch("/api/bills/getbills", {
      billId: id,
      rentStatus: !isRPaid,
      method: "rent",
    });
    if (refetch) await refetch();
    setIsMoneyAdding({ id: "", state: false, method: "" });
    toast.success("Rent status updated");
  };

  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payModalData, setPayModalData] = useState(null);
  const [invoiceData, setInvoiceData] = useState([]);
  const [advanceMealAmount, setAdvanceMealAmount] = useState(1000);

  const closePayModal = () => {
    setIsPayModalOpen(false);
    setInvoiceData([]);
    setPayModalData(null);
  };

  const openPayModal = async () => {
    if (user.email != "akibrahman5200@gmail.com") {
      toast.success("Coming Very Soon...");
      return;
    }
    setIsPayModalOpen(true);
    try {
      const { data } = await axios.put("/api/bkash/create", { id });
      if (!data.success) throw new Error(data?.msg);
      setPayModalData(data);
    } catch (error) {
      closePayModal();
      toast.error(error?.message || "Server Error");
    }
  };

  const bkashPay = async () => {
    try {
      const { data } = await axios.post("/api/bkash/create", {
        billId: id,
        invoiceData: invoiceData.reduce((acc, current) => {
          const existing = acc.find((item) => item.name == current.name);
          if (existing) {
            existing.value += current.value;
          } else {
            acc.push(current);
          }

          return acc;
        }, []),
      });
      console.log(data);
      if (data.statusCode == "0000") route.push(data.bkashURL);
      else {
        closePayModal();
        toast.error("Something went wrong, Try again");
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.msg ||
          error?.message ||
          "Something went wrong, Try again"
      );
      closePayModal();
    }
  };

  return (
    <>
      {isPayModalOpen && (
        <div className="fixed z-[50000] top-0 left-0 w-full h-screen bg-[rgba(0,0,0,0.5)]">
          {payModalData ? (
            <div className="absolute text-pink-600 top-[40%] md:top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-white md:h-[80%] w-[95%] md:w-[60%] rounded-xl pb-5 md:pb-0">
              <FaTimes
                className="text-2xl absolute top-1 right-2 text-slate-200 cursor-pointer duration-300 active:scale-90 bg-pink-600 aspect-square rounded-full p-1"
                onClick={closePayModal}
              />
              <p className="w-full text-center mx-auto bg-pink-600 text-white rounded-xl py-1">
                ID: {`${"*".repeat(id.length - 5)}${id.slice(-5)}`}
              </p>

              <div className="flex items-center gap-0 md:gap-2 font-semibold justify-center py-3">
                <Image
                  src="/images/bkash.png"
                  className="bg-white px-3 py-0.5 rounded-md cursor-pointer active:scale-90 hover:scale-105 duration-300"
                  alt="bKash Pay button"
                  width={"120"}
                  height={"40"}
                />
                <p className="text-sm md:text-base">
                  Pay with BKash hassle-free
                </p>
              </div>
              <div className="">
                {status == "initiated" && (
                  <>
                    <div className="flex items-center justify-center gap-2 mb-4 text-sm md:text-base">
                      <p>Enter Advance Meal Amount:</p>
                      <input
                        type="number"
                        placeholder="Meal Amount"
                        value={advanceMealAmount}
                        onChange={(e) => {
                          setInvoiceData(
                            invoiceData.filter(
                              (item) => item.name != `Advance Meal-${month}`
                            )
                          );
                          setAdvanceMealAmount(parseInt(e.target.value));
                        }}
                        className="px-4 md:px-10 py-1.5 w-[100px] md:w-[200px] placeholder:text-pink-600 bg-pink-200 outline-none rounded-full"
                      />
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2 md:gap-5 text-sm md:text-base">
                      {/* Room Rent  */}
                      <div
                        onClick={() => {
                          const newItem = {
                            name: `Rent-${month}`,
                            value: payModalData?.rent,
                          };
                          const exists = invoiceData.some(
                            (item) =>
                              item.name == newItem.name &&
                              item.value == newItem.value
                          );
                          if (exists) {
                            setInvoiceData(
                              invoiceData.filter(
                                (item) => item.name != newItem.name
                              )
                            );
                          } else {
                            setInvoiceData([...invoiceData, newItem]);
                          }
                        }}
                        className={`duration-300 border border-pink-600 px-4 py-1 hover:scale-105 active:scale-90 flex items-center justify-center gap-2 font-semibold cursor-pointer select-none ${
                          invoiceData.some(
                            (item) =>
                              item.name == `Rent-${month}` &&
                              item.value == payModalData?.rent
                          )
                            ? "bg-pink-600 text-white"
                            : "bg-white text-pink-600"
                        }`}
                      >
                        <p>Seat Rent</p>
                        <p>{payModalData?.rent}</p>
                        <p>BDT</p>
                      </div>
                      {/* Advance Meal*/}
                      <div
                        onClick={() => {
                          if (!advanceMealAmount || advanceMealAmount <= 0)
                            return toast.error("Advance Meal Amount is Empty");
                          const newItem = {
                            name: `Advance Meal-${month}`,
                            value: advanceMealAmount,
                          };
                          const exists = invoiceData.some(
                            (item) =>
                              item.name == newItem.name &&
                              item.value == newItem.value
                          );
                          if (exists) {
                            setInvoiceData(
                              invoiceData.filter(
                                (item) =>
                                  item.name != newItem.name ||
                                  item.value != newItem.value
                              )
                            );
                          } else {
                            setInvoiceData([...invoiceData, newItem]);
                          }
                        }}
                        className={`duration-300 border border-pink-600 px-4 py-1 hover:scale-105 active:scale-90 flex items-center justify-center gap-2 font-semibold cursor-pointer select-none ${
                          invoiceData.some(
                            (item) =>
                              item.name == `Advance Meal-${month}` &&
                              item.value == advanceMealAmount
                          )
                            ? "bg-pink-600 text-white"
                            : "bg-white text-pink-600"
                        }`}
                      >
                        <p>Advance Meal {advanceMealAmount || 0} BDT</p>
                      </div>
                      {/* Wifi 150 */}
                      <div
                        onClick={() => {
                          const newItem = {
                            name: `Wifi-${month}`,
                            value: 150,
                          };
                          const exists = invoiceData.some(
                            (item) =>
                              item.name == newItem.name &&
                              item.value == newItem.value
                          );
                          if (exists) {
                            setInvoiceData(
                              invoiceData.filter(
                                (item) => item.name != newItem.name
                              )
                            );
                          } else {
                            setInvoiceData([...invoiceData, newItem]);
                          }
                        }}
                        className={`duration-300 border border-pink-600 px-4 py-1 hover:scale-105 active:scale-90 flex items-center justify-center gap-2 font-semibold cursor-pointer select-none ${
                          invoiceData.some(
                            (item) =>
                              item.name == `Wifi-${month}` && item.value == 150
                          )
                            ? "bg-pink-600 text-white"
                            : "bg-white text-pink-600"
                        }`}
                      >
                        <p>Wi-Fi 150 BDT</p>
                      </div>
                    </div>
                    <p className="text-xs text-center mt-2">
                      *Click above any to pay
                    </p>
                    <p className="text-xs text-center mt-1">
                      *You can customize your Meal amount
                    </p>
                    <p className="mt-4 text-xl text-center font-bold">
                      Total:{" "}
                      {Math.ceil(invoiceData.reduce((a, c) => a + c.value, 0))}{" "}
                      BDT
                    </p>
                  </>
                )}
                {status == "calculated" && (
                  <>
                    <div className="flex flex-wrap items-center justify-center gap-5">
                      {/* Due  */}
                      <div
                        onClick={() => {
                          const newItem = {
                            name: `Due-${month}`,
                            value:
                              totalBillInBDT -
                              transactions?.reduce((total, transaction) => {
                                const transactionSum =
                                  transaction.payments.reduce(
                                    (sum, payment) => sum + payment.value,
                                    0
                                  );
                                return total + transactionSum;
                              }, 0),
                          };
                          const exists = invoiceData.some(
                            (item) =>
                              item.name == newItem.name &&
                              item.value == newItem.value
                          );
                          if (exists) {
                            setInvoiceData(
                              invoiceData.filter(
                                (item) => item.name != newItem.name
                              )
                            );
                          } else {
                            setInvoiceData([...invoiceData, newItem]);
                          }
                        }}
                        className={`duration-300 border border-pink-600 px-4 py-1 hover:scale-105 active:scale-90 flex items-center justify-center gap-2 font-semibold cursor-pointer select-none ${
                          invoiceData.some(
                            (item) =>
                              item.name == `Due-${month}` &&
                              item.value ==
                                totalBillInBDT -
                                  transactions?.reduce((total, transaction) => {
                                    const transactionSum =
                                      transaction.payments.reduce(
                                        (sum, payment) => sum + payment.value,
                                        0
                                      );
                                    return total + transactionSum;
                                  }, 0)
                          )
                            ? "bg-pink-600 text-white"
                            : "bg-white text-pink-600"
                        }`}
                      >
                        <p>Due</p>
                        <p>
                          {totalBillInBDT -
                            transactions?.reduce((total, transaction) => {
                              const transactionSum =
                                transaction.payments.reduce(
                                  (sum, payment) => sum + payment.value,
                                  0
                                );
                              return total + transactionSum;
                            }, 0)}
                        </p>
                        <p>BDT</p>
                      </div>
                    </div>
                    <p className="text-xs text-center mt-1">
                      *Click above any to pay
                    </p>
                    <p className="mt-4 text-xl text-center font-bold">
                      Total:{" "}
                      {Math.ceil(invoiceData.reduce((a, c) => a + c.value, 0))}{" "}
                      BDT
                    </p>
                  </>
                )}
              </div>

              {invoiceData.length > 0 && (
                <button
                  onClick={bkashPay}
                  className="px-10 py-1 rounded-md duration-300 active:scale-90 hover:scale-105 bg-pink-600 text-white font-semibold mx-auto mt-5 block"
                >
                  Pay
                </button>
              )}
            </div>
          ) : (
            <div className="absolute text-pink-600 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-transparent h-[80%] w-[60%] rounded-xl flex items-center justify-center">
              <CgSpinner className="text-3xl animate-spin" />
            </div>
          )}
        </div>
      )}
      {showTransactions && (
        <div className="font-medium rounded-lg h-[350px] w-full relative border border-blue-500 md:px-4 overflow-y-scroll pb-5">
          <FaTimes
            className="absolute top-2 right-2 cursor-pointer text-xl text-white"
            onClick={() => setShowTransactions(false)}
          />
          <p className="text-center pt-3 font-bold text-blue-500 underline">
            Transactions
          </p>
          <div className="py-3 font-bold text-blue-500 underline flex items-center justify-center gap-3">
            <p className="">{userName}</p>
            <p className="">{month}</p>
            <p className="">{year}</p>
          </div>
          {transactions.length == 0 && (
            <p className="text-center py-3">No Transactions Found</p>
          )}
          {transactions.map((t) => (
            <div
              className="w-full mb-1 border border-blue-500 flex items-center justify-between px-5 py-2 border-r-0 border-l-0 shadow shadow-blue-500 text-sm md:text-base"
              key={t._id}
            >
              <p>{new Date(t.transactionDate).toDateString()}</p>
              <p className="">{t.transactionId}</p>
              <p>{t.payments.reduce((a, c) => a + c.value, 0)} BDT</p>
              <FaEye
                className="text-lg cursor-pointer active:scale-90 duration-300"
                onClick={() => window.open(`/qr/${t.transactionId}`, "_blank")}
              />
            </div>
          ))}
          <p className="text-center pt-3 font-bold text-blue-500 underline mt-auto">
            Total Deposit:{" "}
            {transactions?.reduce((total, transaction) => {
              const transactionSum = transaction.payments.reduce(
                (sum, payment) => sum + payment.value,
                0
              );
              return total + transactionSum;
            }, 0)}{" "}
            BDT
          </p>
        </div>
      )}
      {showTransactions || (
        <div className="font-medium rounded-xl">
          <div className="border-b py-3 rounded-tl-lg rounded-tr-lg bg-blue-500 flex items-center justify-around">
            <p className="text-white text-lg text-right">The Crown Inc.</p>
            <button
              onClick={() => setShowTransactions(true)}
              className="px-3 py-0.5 bg-white text-blue-500 font-semibold cursor-pointer active:scale-90 duration-300 rounded-full"
            >
              Transactions
            </button>
          </div>
          <div className="bg-blue-500 px-12 py-3 flex items-center justify-between">
            <div className="">
              <p className="text-white">Bill For</p>
              <p className="text-white text-lg">{userName}</p>
            </div>
            <div className="flex items-center justify-center gap-2">
              <p className="w-max">Rent paid</p>
              {isManageable ? (
                isMoneyAdding.id == id &&
                isMoneyAdding.method == "rent" &&
                isMoneyAdding.state ? (
                  <CgSpinner className="text-xl animate-spin text-white" />
                ) : (
                  <span
                    onClick={rentStatusChange}
                    className="relative w-6 h-6 flex items-center justify-center bg-white border-2 border-gray-300 rounded-md transition-colors duration-200 ease-in-out cursor-pointer"
                  >
                    <svg
                      className={`w-4 h-4 text-green-500 transition-opacity duration-200 ease-in-out ${
                        isRPaid ? "opacity-100" : "opacity-0"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </span>
                )
              ) : isRentPaid ? (
                <TiTick className="text-2xl text-white" />
              ) : (
                <FaTimes className="text-xl text-red-500" />
              )}
            </div>
          </div>

          <div className="bg-white px-12 py-4 flex items-center justify-center gap-6 md:gap-0 md:justify-evenly flex-wrap md:flex-nowrap text-center">
            <div className="">
              <p className="text-sm leading-5 uppercase text-gray-400">Month</p>
              <p className="text-[#061D53]">{month}</p>
            </div>
            <div className="">
              <p className="text-sm leading-5 uppercase text-gray-400">Year</p>
              <p className="text-[#061D53]">{year}</p>
            </div>
            <div className="">
              <p className="text-sm leading-5 uppercase text-gray-400">
                Deposit
              </p>
              <p className="text-[#061D53]">
                {transactions?.reduce((total, transaction) => {
                  const transactionSum = transaction.payments.reduce(
                    (sum, payment) => sum + payment.value,
                    0
                  );
                  return total + transactionSum;
                }, 0)}{" "}
                BDT
              </p>
            </div>
            <div className="">
              <p className="text-sm leading-5 uppercase text-gray-400">Bill</p>
              <p className="text-[#061D53]">{totalBillInBDT} BDT</p>
            </div>
          </div>

          <div className="bg-white px-12 pb-2 grid grid-cols-3 place-items-center gap-5 text-center">
            <div className="">
              <p className="text-sm leading-5 uppercase text-gray-400">
                Breakfast
              </p>
              <p className="text-[#061D53]">{totalBreakfast}</p>
            </div>
            <div className="">
              <p className="text-sm leading-5 uppercase text-gray-400">Lunch</p>
              <p className="text-[#061D53]">{totalLunch}</p>
            </div>
            <div className="">
              <p className="text-sm leading-5 uppercase text-gray-400">
                Dinner
              </p>
              <p className="text-[#061D53]">{totalDinner}</p>
            </div>
          </div>
          {charges && charges.length > 0 && (
            <>
              <p className="text-center text-[#061D53] bg-white pb-2 underline font-bold">
                Charges
              </p>
              <div className="bg-white px-12 pb-4 grid grid-cols-3 place-items-center gap-5 text-center">
                {charges.map((crg, i) => (
                  <div key={i} className="">
                    <p className="text-sm leading-5 uppercase text-gray-400">
                      {crg.note}
                    </p>
                    <p className="text-[#061D53]">{crg.amount} BDT</p>
                  </div>
                ))}
              </div>
            </>
          )}
          <div className="flex py-3 gap-4 justify-around items-center rounded-br-lg rounded-bl-lg border border-blue-600">
            {(transactions?.reduce((total, transaction) => {
              const transactionSum = transaction.payments.reduce(
                (sum, payment) => sum + payment.value,
                0
              );

              return total + transactionSum;
            }, 0) == totalBillInBDT &&
              status == "calculated") ||
              isManageable || (
                <Image
                  onClick={openPayModal}
                  src="/images/bkash.png"
                  className="bg-white px-3 py-0.5 rounded-md cursor-pointer active:scale-90 hover:scale-105 duration-300"
                  alt="bKash Pay button"
                  width={"90"}
                  height={"30"}
                />
              )}
            {(transactions?.reduce((total, transaction) => {
              const transactionSum = transaction.payments.reduce(
                (sum, payment) => sum + payment.value,
                0
              );

              return total + transactionSum;
            }, 0) == totalBillInBDT &&
              status == "calculated") ||
              !isManageable || (
                <button
                  onClick={() =>
                    route.push(
                      `/dashboard?displayData=managerManualInvouce&billId=${id}`
                    )
                  }
                  className="bg-green-500 text-white px-4 py-0.5 duration-300 rounded flex items-center gap-3 active:scale-90 w-max text-sm md:text-base"
                >
                  Generate Invoice
                  {isMoneyAdding.state &&
                    isMoneyAdding.id == id &&
                    isMoneyAdding.method == "makePaid" && (
                      <CgSpinner className="text-xl text-white cursor-pointer animate-spin" />
                    )}
                </button>
              )}
            {status == "initiated" ? (
              <p className=" text-blue-600 font-bold">Not Calculated</p>
            ) : transactions?.reduce((total, transaction) => {
                const transactionSum = transaction.payments.reduce(
                  (sum, payment) => sum + payment.value,
                  0
                );
                return total + transactionSum;
              }, 0) == totalBillInBDT ? (
              <p className=" text-green-600 font-bold">Paid</p>
            ) : (
              <>
                <div className="flex items-center justify-center gap-2">
                  <p className="font-bold text-red-600">Due</p>
                  <p className="text-white">
                    Total:{" "}
                    <span className="text-blue-500 font-bold">
                      {totalBillInBDT -
                        transactions?.reduce((total, transaction) => {
                          const transactionSum = transaction.payments.reduce(
                            (sum, payment) => sum + payment.value,
                            0
                          );
                          return total + transactionSum;
                        }, 0)}{" "}
                      BDT
                    </span>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Receipt;
