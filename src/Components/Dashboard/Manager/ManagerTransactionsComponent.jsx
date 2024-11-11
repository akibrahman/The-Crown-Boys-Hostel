"use client";
import PreLoader from "@/Components/PreLoader/PreLoader";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { convertCamelCaseToCapitalized } from "@/utils/camelToCapitalize";
import SystemPagination from "@/Components/Pagination/Pagination";
import { CgSpinner } from "react-icons/cg";

const ManagerTransactionsComponent = ({ user }) => {
  const router = useRouter();

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

  const [page, setPage] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);

  const totalPages = Math.ceil(totalTransactions / 10);
  const pages = [...new Array(totalPages ? totalPages : 0).fill(0)];

  const { data: transactions } = useQuery({
    queryKey: ["manager", "transactions", user?._id, page],
    queryFn: async ({ queryKey }) => {
      const { data } = await axios.get(
        `/api/transactions?forManager=${true}&page=${queryKey[3]}`
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
      <p className="text-center font-semibold text-xl dark:text-white">
        Transactions
      </p>
      <div className="flex flex-col gap-3 mt-5">
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
            <p
              className={`px-1 md:px-4 py-0.5 rounded-md md:rounded-full text-white font-medium text-[10px] md:text-base ${
                t?.method == "bkash" ? "bg-pink-500" : "bg-blue-500"
              }`}
            >
              {convertCamelCaseToCapitalized(t?.method || "cash")}
            </p>
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
