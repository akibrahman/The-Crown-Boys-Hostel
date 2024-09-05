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

const ManagerSendNotificationComponent = () => {
  const { user } = useContext(AuthContext);
  const [sendState, setSendState] = useState("");
  const [receiver, setReceiver] = useState([]);
  const [isSending, setIsSending] = useState(false);

  const route = useRouter();
  const { data: clients } = useQuery({
    queryKey: ["clients", "manager", user?._id, "notification"],
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
            fcm: client.fcm,
          };
        });
        return requiredData;
      } else return [];
    },
    enabled: user?._id && user?.role == "manager" ? true : false,
  });
  const sendNotification = async (e) => {
    e.preventDefault();
    if (!sendState) return toast.error("Select option!");
    if (receiver.length <= 0) return toast.error("No Receiver Selected!");
    console.log(e.target.title.value);
    console.log(e.target.body.value);
    console.log(receiver.map((r) => (r.fcm ? r.label : "")));
    // console.log(receiver);
  };
  if (!user) return <PreLoader />;
  if (user.role != "manager") {
    route.push("/");
    return;
  }
  if (user?.success == false) return route.push("/signin");
  return (
    <div className="min-h-full p-6 bg-dashboard text-slate-100">
      <div className="flex items-center justify-center gap-3">
        <p className="text-center font-semibold text-2xl dark:text-white relative flex items-center justify-between">
          Send Notification
        </p>
        <p>Total Clients: {clients?.length}</p>
        <p>
          Total FCM Generated: {clients?.filter((c) => c?.fcm != "").length}
        </p>
      </div>
      <form onSubmit={sendNotification} className="">
        <div className="flex flex-col gap-6 md:flex-row md:gap-0 items-center md:justify-between w-[80%] mx-auto mt-6">
          <div className="">
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
          <input
            placeholder="Enter Title"
            required
            name="title"
            className="w-full md:w-[80%] rounded-xl bg-transparent text-white p-5 font-medium outline-none border resize-none"
          ></input>
          <input
            placeholder="Enter Body"
            required
            name="body"
            className="w-full md:w-[80%] rounded-xl bg-transparent text-white p-5 font-medium outline-none border resize-none"
          ></input>
        </div>
        <button className="bg-sky-500 px-6 py-1 rounded-full font-medium text-white duration-300 active:scale-90 hover:scale-105 select-none mx-auto flex items-center gap-3">
          Send
          {isSending && <CgSpinner className="text-xl animate-spin" />}
        </button>
      </form>
    </div>
  );
};

export default ManagerSendNotificationComponent;
