"use client";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { FaEye } from "react-icons/fa";
import Link from "next/link";
import { convertCamelCaseToCapitalized } from "@/utils/camelToCapitalize";
import SystemPagination from "@/Components/Pagination/Pagination";
import { CgSpinner } from "react-icons/cg";

const ManagerTransactionsComponent = ({ user }) => {
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);

  const totalPages = Math.ceil(totalTransactions / itemsPerPage);
  const pages = [...new Array(totalPages ? totalPages : 0).fill(0)];

  const { data: transactions } = useQuery({
    queryKey: [
      "manager",
      "transactions",
      user?._id,
      page,
      itemsPerPage,
      selectedMonth,
    ],
    queryFn: async ({ queryKey }) => {
      const { data } = await axios.get(
        `/api/transactions?forManager=${true}&page=${
          queryKey[3]
        }&limit=${itemsPerPage}&month=${selectedMonth}`
      );
      if (data.success) {
        setTotalTransactions(data.lengthForPagination);
        return data.transactions;
      }
    },
    enabled: user?._id && user?.role == "manager" ? true : false,
  });

  if (!transactions)
    return (
      <div className="min-h-full p-2 md:p-5 bg-dashboard text-slate-100 flex items-center justify-center gap-2">
        <CgSpinner className="animate-spin text-2xl text-white" />
        <p>Loading Transactions...</p>
      </div>
    );

  return (
    <div className="min-h-full p-2 md:p-5 bg-dashboard text-slate-100 relative">
      <p className="text-center font-semibold text-xl md:text-2xl dark:text-white">
        Transactions
      </p>
      <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 mt-3 md:mt-4 text-stroke font-semibold text-sm md:text-base">
        <div className="flex items-center justify-center gap-3 md:gap-6">
          <p>
            {transactions.length}/{totalTransactions}
          </p>
          <select
            className="text-dark-black outline-none cursor-pointer px-2 md:px-4 py-0.5 md:py-1 rounded-md scrollbar-hide"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(e.target.value)}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
            <option value="50">50</option>
            <option value="70">70</option>
            <option value="all">All</option>
          </select>
          <select
            className="text-dark-black outline-none cursor-pointer px-2 md:px-4 py-0.5 md:py-1 rounded-md scrollbar-hide"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="0">Select Month</option>
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
        </div>
        <div className="flex items-center justify-center gap-3 md:gap-6">
          <p>
            Cash:{" "}
            {transactions
              .filter((t) => (t?.method && t?.method == "bkash" ? false : true))
              .reduce(
                (a, c) => a + c.payments.reduce((a2, c2) => a2 + c2.value, 0),
                0
              )}{" "}
            ৳
          </p>
          <p>
            Bkash:{" "}
            {transactions
              .filter((t) => (t?.method && t?.method == "bkash" ? true : false))
              .reduce(
                (a, c) => a + c.payments.reduce((a2, c2) => a2 + c2.value, 0),
                0
              )}{" "}
            ৳
          </p>
          <p>
            Total:{" "}
            {transactions
              .filter((t) => (t?.method && t?.method == "bkash" ? false : true))
              .reduce(
                (a, c) => a + c.payments.reduce((a2, c2) => a2 + c2.value, 0),
                0
              ) +
              transactions
                .filter((t) =>
                  t?.method && t?.method == "bkash" ? true : false
                )
                .reduce(
                  (a, c) => a + c.payments.reduce((a2, c2) => a2 + c2.value, 0),
                  0
                )}{" "}
            ৳
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-3 mt-3 md:mt-4">
        {transactions.map((t, i) => (
          <div
            className="shadow-lg px-1 md:px-4 py-2 flex items-center justify-center md:justify-between gap-3 md:gap-0"
            key={t._id}
          >
            <p className="text-[10px] md:text-base">{i + 1}.</p>
            <Image
              src={
                !t?.userDetails?.profilePicture ||
                t?.userDetails?.profilePicture == "/__"
                  ? "/images/no-user.png"
                  : t?.userDetails?.profilePicture
              }
              alt={`Profile Picture of ${t?.userDetails?.username}`}
              width="40"
              height="40"
              className="w-8 md:w-10 h-8 md:h-10 rounded-full aspect-square"
            />
            <p
              className="w-[80px] overflow-hidden text-wrap md:w-[150px] text-[10px] md:text-base"
              title={t?.userDetails?.username || t.userId}
            >
              {t?.userDetails?.username || t.userId}
            </p>
            <p className="w-[60px] md:w-[70px] text-[10px] md:text-base">
              {t.payments.reduce((a, c) => a + c.value, 0)} ৳
            </p>
            <div className="flex flex-col items-center justify-center gap-1">
              <p
                className={`font-medium text-[10px] md:text-sm ${
                  t?.method == "bkash" ? "text-pink-500" : "text-blue-500"
                }`}
              >
                {convertCamelCaseToCapitalized(t?.method || "cash")}
              </p>
              <p
                className={`text-[10px] md:text-sm font-medium px-2 py-0 md:py-0.5 rounded-full ${
                  t.isAssigned
                    ? "text-green-700 bg-green-200"
                    : "text-orange-700 bg-orange-200"
                }`}
              >
                {t.isAssigned ? "Assigned" : "Unassigned"}
              </p>
            </div>
            <p className="w-[140px] md:w-[240px] text-[10px] md:text-base">
              {new Date(t.transactionDate).toDateString()}
              <br className="block md:hidden" />
              <span className="md:px-2 px-0.5"></span>
              {new Date(t.transactionDate).toLocaleTimeString()}
            </p>
            <Link href={`/qr/${t.transactionId}`} target="_blank">
              <FaEye className="md:text-xl duration-300 active:scale-90 text-blue-500 font-semibold hover:text-white cursor-pointer" />
            </Link>
          </div>
        ))}
      </div>
      <SystemPagination
        page={page}
        setPage={setPage}
        pages={pages}
        totalPages={totalPages}
        onlyButtons={true}
      />
    </div>
  );
};

export default ManagerTransactionsComponent;
