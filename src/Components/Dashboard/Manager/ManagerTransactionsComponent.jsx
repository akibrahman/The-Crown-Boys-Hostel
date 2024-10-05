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
import { FaTimes } from "react-icons/fa";
import Select from "react-select";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { convertCamelCaseToCapitalized } from "@/utils/camelToCapitalize";

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

  const { data: transactions } = useQuery({
    queryKey: ["manager", "transactions", user?._id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/transactions?forManager=${true}`);
      if (data.success) {
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
            <p>{i + 1}</p>
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
            <p>{t.payments.reduce((a, c) => a + c.value, 0)} ৳</p>
            <p
              className={`px-4 py-0.5 rounded-full text-white font-medium ${
                t?.method == "bkash" ? "bg-pink-500" : "bg-blue-500"
              }`}
            >
              {convertCamelCaseToCapitalized(t?.method || "cash")}
            </p>
            <p>
              {new Date(t.transactionDate).toDateString()}
              <span className="px-2"></span>
              {new Date(t.transactionDate).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagerTransactionsComponent;
