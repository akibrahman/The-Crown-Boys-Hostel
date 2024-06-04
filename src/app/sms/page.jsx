"use client";

import { AuthContext } from "@/providers/ContextProvider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import Select from "react-select";

const SMS = () => {
  const { user } = useContext(AuthContext);
  const [sendState, setSendState] = useState("single");
  const [receiver, setReceiver] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const { data: smsBalance } = useQuery({
    queryKey: ["smsBalance", "managerOnly"],
    queryFn: async () => {
      const { data } = await axios.get("/api/sms");
      if (data.success) return data.balance;
      else return 0;
    },
  });
  const { data: clients } = useQuery({
    queryKey: ["clients", "manager", user?._id, "sms"],
    queryFn: async ({ queryKey }) => {
      const { data } = await axios.get(
        `/api/clients/getclients?id=${queryKey[2]}&onlyApproved=1&clientName=`
      );
      if (data.success) {
        const actualData = data.clients;
        const requiredData = actualData.map((client) => {
          return {
            value: client._id,
            label: client.username + " - " + client.contactNumber,
            number: client.contactNumber,
          };
        });
        return requiredData;
      } else return [];
    },
    enabled: user?._id && user?.role == "manager" ? true : false,
  });
  const sendSms = async (e) => {
    e.preventDefault();
    if (parseInt(smsBalance) <= 5) {
      toast.error("Balance is low! Please recharge.");
      return;
    }
    if (receiver.length == 0) return toast.error("Select receiver(s)");
    const msg = e.target.msg.value;
    setIsSending(true);
    try {
      const { data } = await axios.post("/api/sms", {
        msg,
        sendState,
        receiver,
      });
      if (data.success) toast.success(data.msg);
      else throw new Error("Server Error!");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong, Try again!");
    } finally {
      if (sendState == "single") setSendState("multiple");
      else setSendState("single");
      e.target.reset();
      setReceiver([]);
      setIsSending(false);
    }
  };
  return (
    <div className="min-h-screen p-6 dark:bg-gradient-to-r dark:from-primary dark:to-secondary">
      <p className="text-center font-semibold text-2xl dark:text-white relative">
        Send SMS
        <span className="absolute top-1/2 -translate-y-1/2 right-0 md:right-10 text-base font-normal">
          Balance:{" "}
          <span className="font-semibold text-sky-500">{smsBalance}</span> BDT
        </span>
      </p>
      <form onSubmit={sendSms} className="">
        <div className="flex flex-col gap-6 md:flex-row md:gap-0 items-center md:justify-between w-[80%] mx-auto mt-6">
          <div className="">
            <div className="flex items-center justify-center gap-6">
              <button
                type="button"
                onClick={() => {
                  setReceiver([]);
                  setSendState("single");
                }}
                className={`px-10 py-2 duration-300 active:scale-90 hover:scale-105 rounded-full font-medium tracking-wider text-white border ${
                  sendState == "single"
                    ? "bg-sky-500 border-sky-500"
                    : "bg-transparent border-white"
                }`}
              >
                Single
              </button>
              <button
                type="button"
                onClick={() => {
                  setSendState("multiple");
                  setReceiver([]);
                }}
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
          <div className="flex items-center justify-center">
            {sendState == "single" && (
              <Select
                className="w-[400px]"
                onChange={(e) => setReceiver([e])}
                options={clients}
              />
            )}
            {sendState == "multiple" && (
              <Select
                className="w-[400px]"
                isMulti={true}
                onChange={(e) => setReceiver(e)}
                options={clients}
              />
            )}
          </div>
        </div>
        <div className="flex justify-center my-10">
          <textarea
            placeholder="Enter the Message........"
            required
            name="msg"
            className="w-[80%] rounded-xl bg-transparent text-white p-5 font-medium outline-none border resize-none"
            rows="10"
            id=""
          ></textarea>
        </div>
        <button className="bg-sky-500 px-6 py-1 rounded-full font-medium text-white duration-300 active:scale-90 hover:scale-105 select-none mx-auto flex items-center gap-3">
          Send
          {isSending && <CgSpinner className="text-xl animate-spin" />}
        </button>
      </form>
    </div>
  );
};

export default SMS;
