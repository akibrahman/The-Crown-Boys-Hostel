import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { FaTimes } from "react-icons/fa";
import { TiTick } from "react-icons/ti";

const Receipt = ({
  id,
  totalBillInBDT = 20,
  paidBillInBDT = 10,
  status = "calculated",
  year = 2024,
  month = "May",
  totalBreakfast = 99,
  totalLunch = 97,
  totalDinner = 66,
  charges,
  managerAmount,
  setManagerAmount,
  userName,
  isManageable = false,
  refetch,
  isRentPaid,
}) => {
  const [isMoneyAdding, setIsMoneyAdding] = useState({
    id: "",
    state: false,
    method: "",
  });

  const route = useRouter();

  const [isRPaid, setIsRPaid] = useState(isRentPaid);

  const rentStatusChange = async () => {
    setIsMoneyAdding({
      id,
      state: true,
      method: "rent",
    });
    setIsRPaid(!isRPaid);
    await axios.patch("/api/bills/getbills", {
      billId: id,
      rentStatus: !isRPaid,
      method: "rent",
    });
    if (refetch) await refetch();
    setIsMoneyAdding({ id: "", state: false, method: "" });
    toast.success("Rent status updated");
  };

  const set = async () => {
    if (managerAmount != null && managerAmount >= 0) {
      setIsMoneyAdding({
        id,
        state: true,
        method: "set",
      });
      await axios.patch("/api/bills/getbills", {
        billId: id,
        amount: parseInt(managerAmount),
        method: "set",
      });
      setManagerAmount(null);
      setIsMoneyAdding({ id: "", state: false, method: "" });
      if (refetch) await refetch();
      toast.success("Amount updated");
    } else {
      toast.error("Please enter amount");
    }
  };

  const credite = async () => {
    if (managerAmount != null && managerAmount >= 0) {
      setIsMoneyAdding({
        id,
        state: true,
        method: "credite",
      });
      await axios.patch("/api/bills/getbills", {
        billId: id,
        amount: parseInt(managerAmount),
        method: "credite",
      });
      setManagerAmount(null);
      setIsMoneyAdding({ id: "", state: false, method: "" });
      if (refetch) await refetch();
      toast.success("Amount updated");
    } else {
      toast.error("Please enter amount");
    }
  };
  const debite = async () => {
    if (managerAmount != null && managerAmount >= 0) {
      setIsMoneyAdding({
        id,
        state: true,
        method: "debite",
      });
      await axios.patch("/api/bills/getbills", {
        billId: id,
        amount: parseInt(managerAmount),
        method: "debite",
      });
      setManagerAmount(null);
      setIsMoneyAdding({ id: "", state: false, method: "" });
      if (refetch) await refetch();
      toast.success("Amount updated");
    } else {
      toast.error("Please enter amount");
    }
  };

  const makePaid = async () => {
    setIsMoneyAdding({
      id,
      state: true,
      method: "makePaid",
    });
    await axios.patch("/api/bills/getbills", {
      billId: id,
      amount: parseInt(totalBillInBDT),
      method: "set",
    });
    setIsMoneyAdding({ id: "", state: false, method: "" });
    if (refetch) await refetch();
    toast.success("Made paid");
  };

  return (
    <div className="font-medium rounded-xl">
      <div className="pr-10 border-b py-3 rounded-tl-lg rounded-tr-lg bg-blue-500">
        <p className="text-white text-lg text-right">The Crown Inc.</p>
      </div>
      <div className="bg-blue-500 px-12 py-3 flex items-center justify-between">
        <div className="">
          <p className="text-white">Bill For</p>
          <p className="text-white text-lg">{userName}</p>
        </div>
        <div className="flex items-center justify-center gap-2">
          <p className="w-max">Rent paid</p>
          {isManageable ? (
            isMoneyAdding.id == id &&
            isMoneyAdding.method == "rent" &&
            isMoneyAdding.state ? (
              <CgSpinner className="text-xl animate-spin text-white" />
            ) : (
              <span
                onClick={rentStatusChange}
                className="relative w-6 h-6 flex items-center justify-center bg-white border-2 border-gray-300 rounded-md transition-colors duration-200 ease-in-out cursor-pointer"
              >
                <svg
                  className={`w-4 h-4 text-green-500 transition-opacity duration-200 ease-in-out ${
                    isRPaid ? "opacity-100" : "opacity-0"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </span>
            )
          ) : isRentPaid ? (
            <TiTick className="text-2xl text-white" />
          ) : (
            <FaTimes className="text-xl text-red-500" />
          )}
        </div>
      </div>

      <div className="bg-white px-12 py-4 flex items-center justify-center gap-6 md:gap-0 md:justify-evenly flex-wrap md:flex-nowrap text-center">
        <div className="">
          <p className="text-sm leading-5 uppercase text-gray-400">Month</p>
          <p className="text-[#061D53]">{month}</p>
        </div>
        <div className="">
          <p className="text-sm leading-5 uppercase text-gray-400">Year</p>
          <p className="text-[#061D53]">{year}</p>
        </div>
        <div className="">
          <p className="text-sm leading-5 uppercase text-gray-400">Deposit</p>
          <p className="text-[#061D53]">{paidBillInBDT} BDT</p>
        </div>
        <div className="">
          <p className="text-sm leading-5 uppercase text-gray-400">Bill</p>
          <p className="text-[#061D53]">{totalBillInBDT} BDT</p>
        </div>
      </div>

      <div className="bg-white px-12 pb-2 grid grid-cols-3 place-items-center gap-5 text-center">
        <div className="">
          <p className="text-sm leading-5 uppercase text-gray-400">Breakfast</p>
          <p className="text-[#061D53]">{totalBreakfast}</p>
        </div>
        <div className="">
          <p className="text-sm leading-5 uppercase text-gray-400">Lunch</p>
          <p className="text-[#061D53]">{totalLunch}</p>
        </div>
        <div className="">
          <p className="text-sm leading-5 uppercase text-gray-400">Dinner</p>
          <p className="text-[#061D53]">{totalDinner}</p>
        </div>
      </div>
      {charges && charges.length > 0 && (
        <>
          <p className="text-center text-[#061D53] bg-white pb-2 underline font-bold">
            Charges
          </p>
          <div className="bg-white px-12 pb-4 grid grid-cols-3 place-items-center gap-5 text-center">
            {charges.map((crg, i) => (
              <div key={i} className="">
                <p className="text-sm leading-5 uppercase text-gray-400">
                  {crg.note}
                </p>
                <p className="text-[#061D53]">{crg.amount} BDT</p>
              </div>
            ))}
          </div>
        </>
      )}
      {isManageable && (
        <div className="bg-white py-3 flex items-center justify-around">
          <button
            onClick={credite}
            className="flex items-center gap-3 px-4 py-1 bg-green-500 text-white duration-300 rounded active:scale-90"
          >
            Credit
            {isMoneyAdding.state &&
              isMoneyAdding.id == id &&
              isMoneyAdding.method == "credite" && (
                <CgSpinner className="text-xl text-white cursor-pointer animate-spin" />
              )}
          </button>
          <button
            onClick={debite}
            className="flex items-center gap-3 px-4 py-1 bg-red-500 text-white duration-300 rounded active:scale-90"
          >
            Debit
            {isMoneyAdding.state &&
              isMoneyAdding.id == id &&
              isMoneyAdding.method == "debite" && (
                <CgSpinner className="text-xl text-white cursor-pointer animate-spin" />
              )}
          </button>
          <button
            onClick={set}
            className="flex items-center gap-3 px-4 py-1 bg-orange-500 text-white duration-300 rounded active:scale-90"
          >
            Set
            {isMoneyAdding.state &&
              isMoneyAdding.id == id &&
              isMoneyAdding.method == "set" && (
                <CgSpinner className="text-xl text-white cursor-pointer animate-spin" />
              )}
          </button>
        </div>
      )}
      <div className="flex py-3 gap-4 justify-around items-center rounded-br-lg rounded-bl-lg border border-blue-600">
        {(paidBillInBDT == totalBillInBDT && status == "calculated") ||
          isManageable || (
            <Image
              onClick={() => toast.success("Coming very soon...")}
              src="/images/bkash.png"
              className="bg-white px-3 py-0.5 rounded-md cursor-pointer active:scale-90 hover:scale-105 duration-300"
              alt="bKash Pay button"
              width={"90"}
              height={"30"}
            />
          )}
        {(paidBillInBDT == totalBillInBDT && status == "calculated") ||
          !isManageable || (
            <button
              onClick={() =>
                route.push(
                  `/dashboard?displayData=managerManualInvouce&billId=${id}`
                )
              }
              className="bg-green-500 text-white px-4 py-0.5 duration-300 rounded flex items-center gap-3 active:scale-90 w-max text-sm md:text-base"
            >
              Generate Invoice
              {isMoneyAdding.state &&
                isMoneyAdding.id == id &&
                isMoneyAdding.method == "makePaid" && (
                  <CgSpinner className="text-xl text-white cursor-pointer animate-spin" />
                )}
            </button>
          )}
        {status == "initiated" ? (
          <p className=" text-blue-600 font-bold">Not Calculated</p>
        ) : paidBillInBDT == totalBillInBDT ? (
          <p className=" text-green-600 font-bold">Paid</p>
        ) : (
          <>
            <div className="flex items-center justify-center gap-2">
              <p className="font-bold text-red-600">Due</p>
              <p className="text-white">
                Total:{" "}
                <span className="text-blue-500 font-bold">
                  {totalBillInBDT - paidBillInBDT} BDT
                </span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Receipt;
