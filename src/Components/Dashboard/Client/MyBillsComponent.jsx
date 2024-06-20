import { useQuery } from "@tanstack/react-query";
import React from "react";
import Receipt from "../../Receipt/Receipt";
import { useRouter } from "next/navigation";
import axios from "axios";

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
    <div className="px-10">
      <p className="text-center font-medium text-xl text-white">My Bills</p>
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
      <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {bills
          ?.sort(
            (a, b) => monthOrder.indexOf(b.month) - monthOrder.indexOf(a.month)
          )
          ?.map((bill) => (
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
              charges={bill?.charges}
              isManageable={false}
            />
          ))}
      </div>
    </div>
  );
};

export default MyBillsComponent;
