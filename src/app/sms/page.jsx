"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

const SMS = () => {
  const [sendState, setSendState] = useState("single");
  const { data: smsBalance } = useQuery({
    queryKey: ["smsBalance", "managerOnly"],
    queryFn: async () => {
      const { data } = await axios.get("/api/sms");
      if (data.success) return data.balance;
      else return 0;
    },
  });
  return (
    <div className="min-h-screen p-6 dark:bg-gradient-to-r dark:from-primary dark:to-secondary">
      <p className="text-center font-semibold text-2xl dark:text-white relative">
        Send SMS
        <span className="absolute top-1/2 -translate-y-1/2 right-10 text-base font-normal">
          Balance:{" "}
          <span className="font-semibold text-sky-500">{smsBalance}</span> BDT
        </span>
      </p>
      <div className="mt-6 flex items-center justify-center gap-6">
        <button
          onClick={() => setSendState("single")}
          className={`px-10 py-2 duration-300 active:scale-90 hover:scale-105 rounded-full font-medium tracking-wider text-white border ${
            sendState == "single"
              ? "bg-sky-500 border-sky-500"
              : "bg-transparent border-white"
          }`}
        >
          Single
        </button>
        <button
          onClick={() => setSendState("multiple")}
          className={`px-10 py-2 duration-300 active:scale-90 hover:scale-105 rounded-full font-medium tracking-wider text-white border ${
            sendState == "multiple"
              ? "bg-sky-500 border-sky-500"
              : "bg-transparent border-white"
          }`}
        >
          Multiple
        </button>
      </div>
    </div>
  );
};

export default SMS;
