import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { GiPayMoney } from "react-icons/gi";

const ManagerMarketDetailsComponent = ({ user }) => {
  const [managerAmount, setManagerAmount] = useState(null);
  const [isMoneyAdding, setIsMoneyAdding] = useState(false);

  const currentMonth = new Date().toLocaleDateString("en-BD", {
    month: "long",
    timeZone: "Asia/Dhaka",
  });
  const currentYear = new Date().toLocaleDateString("en-BD", {
    year: "numeric",
    timeZone: "Asia/Dhaka",
  });

  const { data: managerCalanderData, refetch: managerCalanderDataRefetch } =
    useQuery({
      queryKey: ["managerCalanderData", "manager", user?._id],
      queryFn: async ({ queryKey }) => {
        try {
          const { data } = await axios.post("/api/markets/getmarkets", {
            managerId: queryKey[2],
            month: currentMonth,
            year: currentYear,
          });
          console.log("Manager Calander Loading");
          return data.market;
        } catch (error) {
          console.log(error);
          return null;
        }
      },
      enabled: user?._id && user?.role == "manager" ? true : false,
    });

  return (
    <div className="bg-dashboard text-slate-100 py-10 min-h-full">
      <p className="font-semibold border border-sky-500 rounded-sm px-4 py-2 relative flex items-center justify-around md:justify-around">
        <input
          placeholder="Enter Amount"
          onChange={(e) => setManagerAmount(parseInt(e.target.value))}
          value={managerAmount || managerAmount == 0 ? managerAmount : ""}
          className="w-[200px] px-5 py-1 rounded-full bg-dashboard text-white placeholder:text-white outline-double"
          type="number"
        />
        <span className="md:w-[300px]">{currentMonth}</span>
      </p>
      <div className="mt-6 flex items-center justify-center flex-wrap gap-4">
        {managerCalanderData?.data?.map((mrkt) => (
          <div
            key={mrkt._id}
            className="relative w-[110px] h-20 rounded-md bg-sky-500 flex items-center justify-center flex-col cursor-pointer after:h-0 after:w-full after:absolute after:bg-[rgba(0,0,0,0.5)] hover:after:h-full after:duration-300 transition-all group"
          >
            {!isMoneyAdding ? (
              <GiPayMoney
                onClick={async () => {
                  if (managerAmount != null && managerAmount >= 0) {
                    setIsMoneyAdding(true);
                    await axios.put("/api/markets/updatemarket", {
                      id1: managerCalanderData._id,
                      id2: mrkt._id,
                      amount: managerAmount,
                    });
                    await managerCalanderDataRefetch();
                    setManagerAmount(null);
                    setIsMoneyAdding(false);
                    toast.success("Amount updated");
                  } else {
                    toast.error("Please enter amount");
                  }
                }}
                className="scale-0 group-hover:scale-100 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sky-500 bg-white z-10 text-[40px] p-1 rounded-md duration-300 transition-all active:scale-90"
              />
            ) : (
              <div className="bg-white z-10 hidden group-hover:block absolute rounded-md">
                {" "}
                <CgSpinner className="text-sky-500 text-[40px] p-1  duration-300 transition-all active:scale-90 group-hover:animate-spin" />
              </div>
            )}
            <span className="font-semibold bg-white text-sky-500 px-2 py-1 rounded-md mb-2 select-none">
              {" "}
              {mrkt.date.split("/")[1] +
                "-" +
                mrkt.date.split("/")[0] +
                "-" +
                mrkt.date.split("/")[2]}
            </span>

            <span className="select-none text-white font-medium">{mrkt.amount} /-</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagerMarketDetailsComponent;
