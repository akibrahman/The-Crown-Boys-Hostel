import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";

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
}) => {
  const [isMoneyAdding, setIsMoneyAdding] = useState({
    id: "",
    state: false,
    method: "",
  });

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
    toast.success("Made paid");
  };

  return (
    <div className="font-medium rounded-xl">
      <div
        style={{ paddingRight: "40px", borderBottomWidth: "1px" }}
        className="bg-blue-500 py-3 rounded-t-xl"
      >
        <p className="text-white text-lg text-right">The Crown Inc.</p>
      </div>
      <div className="bg-blue-500 px-12 py-3">
        <p className="text-white">Bill For</p>
        <p className="text-white text-lg">Student Name</p>
      </div>

      <div className="bg-white px-12 py-4 grid grid-cols-2 md:grid-cols-4 place-items-center gap-5 text-center">
        <div className="">
          <p className="uppercase text-[#989898] text-sm">Month</p>
          <p className="text-[#061D53]">{month}</p>
        </div>
        <div className="">
          <p className="uppercase text-[#989898] text-sm">Year</p>
          <p className="text-[#061D53]">{year}</p>
        </div>
        <div className="">
          <p className="uppercase text-[#989898] text-sm">Deposit</p>
          <p className="text-[#061D53]">{paidBillInBDT} BDT</p>
        </div>
        <div className="">
          <p className="uppercase text-[#989898] text-sm">Total</p>
          <p className="text-[#061D53]">{totalBillInBDT} BDT</p>
        </div>
      </div>

      <div className="bg-white px-12 pb-2 grid grid-cols-3 place-items-center gap-5 text-center">
        <div className="">
          <p className="uppercase text-[#989898] text-sm">Breakfast</p>
          <p className="text-[#061D53]">{totalBreakfast}</p>
        </div>
        <div className="">
          <p className="uppercase text-[#989898] text-sm">Lunch</p>
          <p className="text-[#061D53]">{totalLunch}</p>
        </div>
        <div className="">
          <p className="uppercase text-[#989898] text-sm">Dinner</p>
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
                <p className="uppercase text-[#989898] text-sm">{crg.note}</p>
                <p className="text-[#061D53]">{crg.amount} BDT</p>
              </div>
            ))}
          </div>
        </>
      )}
      {(status == "initiated" ||
        (paidBillInBDT != totalBillInBDT && status == "calculated")) && (
        <div className="bg-white py-3 flex items-center justify-around">
          <button
            onClick={credite}
            className="flex items-center gap-3 px-4 py-1 bg-green-500 text-white duration-300 rounded active:scale-90"
          >
            Credite
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
            Debite
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
      <div className="border border-blue-600 pr-2 md:pr-10 py-3 flex items-center justify-end gap-4 rounded-b-xl">
        {status == "initiated" ? (
          <p className=" text-blue-600 font-bold">Not Calculated</p>
        ) : totalBillInBDT == paidBillInBDT ? (
          <p className=" text-green-600 font-bold">Paid</p>
        ) : (
          <>
            <button
              onClick={makePaid}
              className="bg-green-500 text-white px-4 py-0.5 duration-300 rounded flex items-center gap-3 active:scale-90"
            >
              Make Paid
              {isMoneyAdding.state &&
                isMoneyAdding.id == id &&
                isMoneyAdding.method == "makePaid" && (
                  <CgSpinner className="text-xl text-white cursor-pointer animate-spin" />
                )}
            </button>
            <p className=" text-red-600 font-bold">Due</p>
          </>
        )}
        {status == "calculated" && (
          <p className="text-white">
            Total:{" "}
            <span className="text-blue-500 font-bold">
              {totalBillInBDT - paidBillInBDT} BDT
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Receipt;
