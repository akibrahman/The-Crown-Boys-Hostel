"use client";
import PreLoader from "@/Components/PreLoader/PreLoader";
import { AuthContext } from "@/providers/ContextProvider";
import { customStylesForReactSelect } from "@/utils/reactSelectCustomStyle";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { FaTimes } from "react-icons/fa";
import Select from "react-select";

const ManagerCountChargeComponent = () => {
  const { user } = useContext(AuthContext);

  const [sendState, setSendState] = useState("");
  const [receiver, setReceiver] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const route = useRouter();
  const { data: clients, isLoading: clientsLoading } = useQuery({
    queryKey: ["clients", "manager", user?._id],
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
          };
        });
        return requiredData;
      } else return [];
    },
    enabled: user?._id && user?.role == "manager" ? true : false,
  });

  const {
    data: countCharges,
    isLoading: countChargesLoading,
    refetch: countChargesRefetch,
  } = useQuery({
    queryKey: ["manager", user?._id, "countCharges", "get"],
    queryFn: async ({ queryKey }) => {
      const { data } = await axios.get(
        `/api/clients/countChargeclient?managerId=${queryKey[1]}`
      );
      if (data.success) {
        return data.charges;
      } else return [];
    },
    enabled: user?._id && user?.role == "manager" ? true : false,
  });

  const [charges, setCharges] = useState([]);

  const setCharge = async () => {
    if (clientsLoading) return;
    if (!sendState) return toast.error("Select option!");
    if (receiver.length <= 0) return toast.error("No Receiver Selected!");
    setIsLoading(true);
    try {
      await axios.post("/api/clients/countChargeclient", {
        clients: receiver,
        charges,
      });
      await countChargesRefetch();
      toast.success("Charges Applied");
    } catch (error) {
      toast.error("Failed to Apply Charge.");
      console.error(error);
    } finally {
      setReceiver([]);
      setSendState("");
      setCharges([]);
      setIsLoading(false);
    }
  };

  const addCharge = async (e) => {
    e.preventDefault();
    const note = e.target.note.value;
    const amount = parseInt(e.target.amount.value);
    const count = parseInt(e.target.count.value);
    e.target.reset();
    setCharges((prevCharges) => [...prevCharges, { note, amount, count }]);
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
          Set Count Charge
        </p>
      </div>
      <form onSubmit={addCharge} className="">
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
                  className={`px-3 md:px-10 py-0.5 md:py-1 duration-300 active:scale-90 hover:scale-105 rounded-full font-medium tracking-wider text-white border ${
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
                  className={`px-3 md:px-10 py-0.5 md:py-1 duration-300 active:scale-90 hover:scale-105 rounded-full font-medium tracking-wider text-white border ${
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
                  className={`px-3 md:px-10 py-0.5 md:py-1 duration-300 active:scale-90 hover:scale-105 rounded-full font-medium tracking-wider text-white border ${
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
        <div className="flex flex-col items-center justify-center gap-1 mb-3 md:mb-6">
          <div className="flex items-center justify-center gap-2 my-3">
            <p className="underline text-base md:text-xl">Charges</p>
            <p>Selected: {receiver.length}</p>
          </div>
          {charges.length == 0 && <p>No Charges Added</p>}
          <div className="flex flex-col items-center justify-center">
            {charges.map((charge, key) => (
              <div
                key={key}
                className="flex items-center justify-center gap-3 px-2 py-0.5 w-full" // Adjust max width to the largest expected size
              >
                <p className="border px-3 text-center py-0.5 min-w-[250px]">
                  {charge.note}
                </p>
                <p className="border px-3 text-center py-0.5 min-w-[60px]">
                  {charge.amount}
                </p>
                <p className="border px-3 text-center py-0.5 min-w-[35px] aspect-square rounded-full flex items-center justify-center">
                  {charge.count}
                </p>
                <FaTimes
                  onClick={() => {
                    setCharges((prevCharges) => {
                      const tempCharges = [...prevCharges];
                      tempCharges.splice(key, 1);
                      return tempCharges;
                    });
                  }}
                  className="text-red-500 text-xl cursor-pointer duration-300 active:scale-90"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center gap-4 mt-2 mb-5">
          <input
            placeholder="Enter Note"
            required
            name="note"
            className="rounded-md bg-transparent text-white px-4 py-1 font-medium outline-none border resize-none"
          ></input>
          <input
            placeholder="Enter Amount"
            type="number"
            required
            name="amount"
            className="rounded-md bg-transparent text-white px-4 py-1 font-medium outline-none border resize-none"
          ></input>
          <input
            placeholder="Enter Count"
            type="number"
            required
            name="count"
            className="rounded-md bg-transparent text-white px-4 py-1 font-medium outline-none border resize-none"
          ></input>
          <button
            type="submit"
            className="bg-sky-500 w-max px-6 py-1 rounded-full font-medium text-white duration-300 active:scale-90 hover:scale-105 select-none flex items-center gap-3"
          >
            Add Charge
          </button>
        </div>
        <button
          type="button"
          onClick={setCharge}
          className="bg-sky-500 w-max px-6 py-1 rounded-full font-medium text-white duration-300 active:scale-90 hover:scale-105 select-none flex items-center gap-3 mx-auto"
        >
          Set Charges
          {isLoading && <CgSpinner className="text-xl animate-spin" />}
        </button>
      </form>
      <div className="w-full">
        <div className="flex items-center justify-center my-3">
          <p className="text-center font-semibold text-2xl text-white relative flex items-center justify-between">
            Charges
          </p>
        </div>
        {countChargesLoading ? (
          <CgSpinner className="animate-spin text-xl text-white my-6 mx-auto text-center" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {countCharges?.map((countCharge) => (
              <div
                key={countCharge._id}
                className="bg-gray-800 rounded-md p-4 mb-4 shadow-md flex items-center gap-6"
              >
                <Image
                  src={countCharge.user.image}
                  alt={countCharge.user.name}
                  height="64"
                  width="64"
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div className="text-white">
                  <h3 className="font-semibold text-lg">{countCharge.note}</h3>
                  <p className="text-sm">
                    <span className="font-semibold">Amount:</span> ৳{" "}
                    {countCharge.amount}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Count:</span>{" "}
                    {countCharge.count}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Name:</span>{" "}
                    {countCharge.user.name}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Email:</span>{" "}
                    {countCharge.user.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerCountChargeComponent;
