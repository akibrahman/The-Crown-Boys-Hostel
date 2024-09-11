import { useQuery } from "@tanstack/react-query";
import React from "react";
import Receipt from "../../Receipt/Receipt";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";

const MyBillsComponent = ({ user }) => {
  const route = useRouter();

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
    <div className="px-10 min-h-full bg-dashboard text-slate-100 overflow-x-hidden">
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
            (a, b) => monthOrder.indexOf(b.month) - monthOrder.indexOf(a.month)
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
  );
};

export default MyBillsComponent;
