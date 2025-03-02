"use client";
import PreLoader from "@/Components/PreLoader/PreLoader";
import { AuthContext } from "@/providers/ContextProvider";
import { customStylesForReactSelect } from "@/utils/reactSelectCustomStyle";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import Select from "react-select";

const ManagerSendSMSComponent = () => {
  const { user } = useContext(AuthContext);
  const [sendState, setSendState] = useState("");
  const [receiver, setReceiver] = useState([]);
  const [isSending, setIsSending] = useState(false);

  const [character, setCharacter] = useState(0);

  const route = useRouter();
  const { data: smsBalance, refetch: smsBalanceRefetch } = useQuery({
    queryKey: ["smsBalance", "managerOnly"],
    queryFn: async () => {
      const { data } = await axios.get("/api/sms");
      if (data.success) return data.balance;
      else return 0;
    },
  });
  const { data: clients, isLoading: clientsLoading } = useQuery({
    queryKey: ["clients", "manager", user?._id, "sms"],
    queryFn: async ({ queryKey }) => {
      const { data } = await axios.get(
        `/api/clients/getclients?id=${queryKey[2]}&onlyApproved=1&clientName=`
      );
      if (data.success) {
        const actualData = data.clients;
        const allUsers = actualData.filter((a) => {
          if (a?.blockDate) {
            if (
              moment(a.blockDate).isSameOrBefore(
                moment(
                  new Date().toLocaleString("en-US", {
                    timeZone: "Asia/Dhaka",
                  }),
                  "M/D/YYYY, h:mm:ss A"
                ),
                "day"
              )
            ) {
              return false;
            } else {
              return true;
            }
          } else {
            return true;
          }
        });
        const requiredData = allUsers.map((client) => {
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
    if (!sendState) return toast.error("Select option!");
    if (
      parseFloat(Math.ceil(character / 70) * 0.35).toFixed(2) *
        receiver.length >=
      smsBalance
    ) {
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
      toast.error(error.response.data.msg);
    } finally {
      e.target.reset();
      setSendState("");
      setReceiver([]);
      setCharacter(0);
      await smsBalanceRefetch();
      setIsSending(false);
    }
  };
  if (!user) return <PreLoader />;
  if (user.role != "manager") {
    route.push("/");
    return;
  }
  if (user?.success == false) return route.push("/signin");
  return (
    <div className="min-h-full p-6 bg-dashboard text-slate-100">
      <p className="text-center font-semibold text-2xl dark:text-white relative flex items-center justify-between">
        Send SMS
        <span className="md:absolute top-1/2 md:-translate-y-1/2 right-0 md:right-10 text-base font-normal">
          Balance:{" "}
          <span className="font-semibold text-sky-500">{smsBalance}</span> BDT
        </span>
      </p>
      <form onSubmit={sendSms} className="">
        <div className="flex flex-col gap-6 md:flex-row md:gap-0 items-center md:justify-between w-[80%] mx-auto mt-6">
          <div className="flex items-center justify-center gap-2">
            {clientsLoading ? (
              <p
                className={`text-sm md:text-base font-medium px-4 md:px-6 py-0.5 md:py-1 rounded-full flex items-center justify-center gap-2 text-blue-700 text-center bg-blue-200`}
              >
                Loading
                <CgSpinner className="text-xl animate-spin" />
              </p>
            ) : (
              <div className="flex items-center md:justify-center gap-3 md:gap-6">
                <button
                  type="button"
                  onClick={() => {
                    setReceiver([]);
                    setSendState("single");
                  }}
                  className={`px-3 md:px-10 py-1 md:py-2 duration-300 active:scale-90 hover:scale-105 rounded-full font-medium tracking-wider text-white border ${
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
                  className={`px-3 md:px-10 py-1 md:py-2 duration-300 active:scale-90 hover:scale-105 rounded-full font-medium tracking-wider text-white border ${
                    sendState == "multiple"
                      ? "bg-sky-500 border-sky-500"
                      : "bg-transparent border-white"
                  }`}
                >
                  Multiple
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSendState("all");
                    setReceiver(clients);
                  }}
                  className={`px-3 md:px-10 py-1 md:py-2 duration-300 active:scale-90 hover:scale-105 rounded-full font-medium tracking-wider text-white border ${
                    sendState == "all"
                      ? "bg-sky-500 border-sky-500"
                      : "bg-transparent border-white"
                  }`}
                >
                  All
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center justify-center">
            {sendState == "single" && (
              <Select
                className="w-[400px]"
                onChange={(e) => setReceiver([e])}
                options={clients}
                styles={customStylesForReactSelect}
              />
            )}
            {sendState == "multiple" && (
              <Select
                className="w-[400px]"
                isMulti={true}
                onChange={(e) => setReceiver(e)}
                options={clients}
                styles={customStylesForReactSelect}
              />
            )}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 my-10">
          <textarea
            onChange={(e) => {
              setCharacter(e.target.value.length);
              console.log(e.target.value.length);
            }}
            placeholder="Enter the Message........"
            required
            name="msg"
            className="w-full md:w-[80%] rounded-xl bg-transparent text-white p-5 font-medium outline-none border resize-none"
            rows="10"
            id=""
          ></textarea>
          <div className="text-white font-medium flex items-center gap-2 md:gap-5">
            <p
              className="flex items-center justify-center gapp1
            "
            >
              Character:{" "}
              <span className="text-sky-500 font-medium">{character}</span>
            </p>
            <p
              className="flex items-center justify-center gapp1
            "
            >
              Section:{" "}
              <span className="text-sky-500 font-medium">
                {Math.ceil(character / 70)}
              </span>
            </p>
            <p
              className="flex items-center justify-center gapp1
            "
            >
              Charge:{" "}
              <span className="text-sky-500 font-medium">
                {parseFloat(
                  Math.ceil(character / 70) * 0.35 * receiver?.length
                ).toFixed(2)}
              </span>
              BDT
            </p>
          </div>
        </div>
        <button className="bg-sky-500 px-6 py-1 rounded-full font-medium text-white duration-300 active:scale-90 hover:scale-105 select-none mx-auto flex items-center gap-3">
          Send
          {isSending && <CgSpinner className="text-xl animate-spin" />}
        </button>
      </form>
    </div>
  );
};

export default ManagerSendSMSComponent;
