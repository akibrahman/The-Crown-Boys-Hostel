import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import Receipt from "../../Receipt/Receipt";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Image from "next/image";

const MyBillsComponent = ({ user }) => {
  const route = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const status = searchParams.get("status");
  const amount = searchParams.get("amount");
  const paymentID = searchParams.get("paymentID");
  const transactionId = searchParams.get("transactionId");
  const bkashTransactionId = searchParams.get("trxId");
  const bkashMessage = searchParams.get("message");

  const clearUrl = () => {
    const url = new URL(window.location.href);
    const baseUrl = url.origin + url.pathname + "?displayData=myBills";
    return route.replace(baseUrl);
  };

  const { data: bills } = useQuery({
    queryKey: ["myBills", user?._id],
    queryFn: async ({ queryKey }) => {
      const { data } = await axios.get(
        `/api/bills/getbills?userId=${queryKey[1]}&month=&year=`
      );
      if (data.success) return data.bills;
      else return null;
    },
  });

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

  const totalDue = bills
    ? bills
        .filter(
          (bill1) =>
            bill1.status == "calculated" &&
            parseInt(bill1.paidBillInBDT) !== parseInt(bill1.totalBillInBDT)
        )
        .reduce((a, c) => a + (c.totalBillInBDT - c.paidBillInBDT), 0)
    : 0;
  return (
    <>
      {/* Success  */}
      {success && paymentID && success == "true" && (
        <div className="fixed z-50 top-0 left-0 w-full h-screen bg-[rgba(0,0,0,0.5)]">
          <motion.div
            initial={{ scale: 0.5, x: "-50%", y: "-50%", opacity: 0 }}
            whileInView={{ scale: 1, x: "-50%", y: "-50%", opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="absolute text-pink-600 top-[45%] md:top-1/2 left-1/2 bg-white md:h-[80%] w-[95%] md:w-[60%] rounded-xl flex flex-col items-center justify-center gap-2 font-medium py-10 md:py-0"
          >
            {" "}
            <Image
              src={"/images/payment-success-tick.png"}
              alt="Payment Successful"
              width={150}
              height={150}
              className="mx-auto"
            />
            <h1 className="text-2xl font-bold text-green-600 mt-4">
              Payment Successful!
            </h1>
            <p className="text-gray-700 md:mt-2 mt-1 px-3 text-center">
              Thank you for your payment. Your transaction has been completed
              successfully.
            </p>
            <p className="text-gray-700 md:mt-2 mt-1">
              Bkash Transaction ID: {bkashTransactionId}
            </p>
            <p className="text-gray-700 md:mt-2 mt-1">
              System Transaction ID: {transactionId}
            </p>
            <p className="text-gray-700 md:mt-2 mt-1">Amount: {amount} BDT</p>
            <button
              onClick={clearUrl}
              className="mt-3 md:mt-6 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300 active:scale-90"
            >
              Got It!
            </button>
          </motion.div>
        </div>
      )}
      {/* Failed  */}
      {success && paymentID && success == "false" && (
        <div className="fixed z-50 top-0 left-0 w-full h-screen bg-[rgba(0,0,0,0.5)]">
          <motion.div
            initial={{ scale: 0.5, x: "-50%", y: "-50%", opacity: 0 }}
            whileInView={{ scale: 1, x: "-50%", y: "-50%", opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="absolute text-pink-600 top-[45%] md:top-1/2 left-1/2 bg-white md:h-[80%] w-[95%] md:w-[60%] rounded-xl flex flex-col items-center justify-center gap-2 font-medium py-10 md:py-0"
          >
            <Image
              src={"/images/payment-failed-tick.png"}
              alt="Payment Successful"
              width={150}
              height={150}
              className="mx-auto"
            />
            <h1 className="text-2xl font-bold text-red-600 mt-4">
              Payment Failed
            </h1>
            <p className="text-gray-700 mt-2">Error Message: {bkashMessage}</p>
            <button
              onClick={clearUrl}
              className="mt-6 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 active:scale-90"
            >
              Try Again
            </button>
          </motion.div>
        </div>
      )}
      <div className="md:px-10 px-2 min-h-full bg-dashboard text-slate-100 overflow-x-hidden">
        <p className="text-center font-medium text-xl text-white py-4">
          My Bills
        </p>
        {totalDue > 0 ? (
          <div className="">
            <p className="text-center dark:text-red-500">
              Oops! You have Due, Please pay as soon as possible.
            </p>
            <p className="text-center font-semibold dark:text-red-500">
              Total Due: {totalDue} BDT
            </p>
          </div>
        ) : (
          <div className="">
            <p className="text-center dark:text-green-500">
              Good Job! You have no Due.
            </p>
          </div>
        )}
        <div className="py-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {bills
            ?.sort(
              (a, b) =>
                monthOrder.indexOf(b.month) - monthOrder.indexOf(a.month)
            )
            ?.map((bill, i) => (
              <motion.div
                key={bill._id}
                initial={{ x: i % 2 === 0 ? -100 : 100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className=""
              >
                <Receipt
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
                  charges={bill?.charges}
                  isManageable={false}
                  isRentPaid={bill.isRentPaid}
                />
              </motion.div>
            ))}
        </div>
      </div>
    </>
  );
};

export default MyBillsComponent;
