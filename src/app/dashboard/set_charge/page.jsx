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
import Swal from "sweetalert2";

const ManagerSetChargeComponent = () => {
  const { user } = useContext(AuthContext);
  const [sendState, setSendState] = useState("");
  const [receiver, setReceiver] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [charges, setCharges] = useState({});

  const route = useRouter();
  const { data: clients, isLoading: clientsLoading } = useQuery({
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
          };
        });
        return requiredData;
      } else return [];
    },
    enabled: user?._id && user?.role == "manager" ? true : false,
  });

  const setCharge = async () => {
    if (clientsLoading) return;
    if (!sendState) return toast.error("Select option!");
    if (receiver.length <= 0) return toast.error("No Receiver Selected!");
    setIsLoading(true);
    try {
      await axios.post("/api/clients/chargeclient", {
        clients: receiver,
        chargeData: charges,
      });
      toast.success("Charge Applied");
    } catch (error) {
      toast.error("Failed to Apply Charge.");
      console.error(error);
    } finally {
      setReceiver([]);
      setSendState("");
      setCharges({});
      setIsLoading(false);
    }
  };

  const addCharge = async (e) => {
    e.preventDefault();
    const note = e.target.note.value;
    const amount = parseInt(e.target.amount.value);
    e.target.reset();
    setCharges((prevCharges) => ({
      ...prevCharges,
      [note]: amount,
    }));
  };

  const clearAllCharges = async (e) => {
    const isConfirmed = await Swal.fire({
      title: "Clear All Charges?",
      text: "You won't be able to revert this! All charges assigned to the users will be deleted permanently",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1493EA",
      cancelButtonColor: "#EF4444",
      confirmButtonText: "Proceed",
      cancelButtonText: "No",
      background: "#141E30",
      color: "#fff",
    });
    if (isConfirmed.isConfirmed) {
      setIsDeleting(true);
      try {
        await axios.delete("/api/clients/chargeclient");
        toast.success("All Charges Deleted");
      } catch (error) {
        toast.error("Failed to Delete Charges.");
        console.error(error);
      } finally {
        setIsDeleting(false);
      }
    } else {
      toast("Operation Cancelled");
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
      <div className="flex items-center justify-center gap-3">
        <p className="text-center font-semibold text-2xl dark:text-white relative flex items-center justify-between">
          Set Charge
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
        <div className="flex items-center justify-center gap-2">
          <button
            className="px-5 py-1 rounded-full text-red-600 bg-red-300 font-semibold duration-300 active:scale-90 my-4 flex items-center justify-center gap-2"
            type="button"
            onClick={clearAllCharges}
          >
            Clear All Charges
            {isDeleting && <CgSpinner className="text-xl animate-spin" />}
          </button>
          <p>Selected: {receiver.length}</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 mb-3 md:mb-6">
          <p className="underline text-base md:text-xl">Charges</p>
          {Object.keys(charges).length == 0 && <p>No Charges Added</p>}
          <div className="flex flex-col items-center justify-center">
            {Object.entries(charges).map(([key, value]) => (
              <div key={key} className="grid grid-cols-2">
                <p className="border min-w-[300px] text-center py-0.5">{key}</p>
                <p className="border min-w-[300px] text-center py-0.5">
                  {value}
                </p>
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
    </div>
  );
};

export default ManagerSetChargeComponent;
