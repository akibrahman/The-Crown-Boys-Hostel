"use client";
import PreLoader from "@/Components/PreLoader/PreLoader";
import Receipt from "@/Components/Receipt/Receipt";
import { customStylesForReactSelect } from "@/utils/reactSelectCustomStyle";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { FaEye, FaTimes } from "react-icons/fa";
import Select from "react-select";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { convertCamelCaseToCapitalized } from "@/utils/camelToCapitalize";
import SystemPagination from "@/Components/Pagination/Pagination";

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

  if (!transactions) return <PreLoader />;

  return (
    <div className="min-h-full p-2 md:p-5 bg-dashboard text-slate-100 relative">
      <p className="text-center font-semibold text-xl dark:text-white">
        Transactions
      </p>
      <div className="flex flex-col gap-3 mt-5">
        {transactions.map((t, i) => (
          <div
            className="shadow-lg px-4 py-2 flex items-center justify-between"
            key={t._id}
          >
            <p>{i + 1}.</p>
            <Image
              src={
                !t.userDetails.profilePicture ||
                t.userDetails.profilePicture == "/__"
                  ? "/images/no-user.png"
                  : t.userDetails.profilePicture
              }
              alt={`Profile Picture of ${t.userDetails.username}`}
              width="40"
              height="40"
              className="w-10 h-10 rounded-full"
            />
            <p
              className="flex-1 max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap"
              title={t.userDetails.username}
            >
              {t.userDetails.username}
            </p>
            <p className="w-[70px]">
              {t.payments.reduce((a, c) => a + c.value, 0)} ৳
            </p>
            <p
              className={`px-4 py-0.5 rounded-full text-white font-medium ${
                t?.method == "bkash" ? "bg-pink-500" : "bg-blue-500"
              }`}
            >
              {convertCamelCaseToCapitalized(t?.method || "cash")}
            </p>
            <p className="w-[240px]">
              {new Date(t.transactionDate).toDateString()}
              <span className="px-2"></span>
              {new Date(t.transactionDate).toLocaleTimeString()}
            </p>
            <Link href={`/qr/${t.transactionId}`} target="_blank">
              <FaEye className="text-xl duration-300 active:scale-90 text-blue-500 font-semibold hover:text-white cursor-pointer" />
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
