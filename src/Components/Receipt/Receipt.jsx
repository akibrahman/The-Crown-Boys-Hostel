import axios from "axios";
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
      <div
        style={{
          paddingRight: "40px",
          borderBottomWidth: "1px",
          paddingTop: "0.75rem",
          paddingBottom: "0.75rem",
          borderTopLeftRadius: "0.75rem",
          borderTopRightRadius: "0.75rem",
          backgroundColor: "#3B82F6",
        }}
        className="bg-blue-500 py-3 rounded-t-xl"
      >
        <p className="text-white text-lg text-right">The Crown Inc.</p>
      </div>
      <div className="bg-blue-500 px-12 py-3 flex items-center justify-between">
        <div className="">
          <p className="text-white">Bill For</p>
          <p className="text-white text-lg">{userName}</p>
        </div>
        <div className="flex items-center justify-center gap-2">
          <p>Rent paid</p>
          {isManageable ? (
            <span
              onClick={() => {
                alert();
              }}
              className="relative w-6 h-6 flex items-center justify-center bg-white border-2 border-gray-300 rounded-md transition-colors duration-200 ease-in-out cursor-pointer"
            >
              <svg
                className={`w-4 h-4 text-green-500 transition-opacity duration-200 ease-in-out ${
                  isRentPaid ? "opacity-100" : "opacity-0"
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
          ) : isRentPaid ? (
            <TiTick className="text-xl text-green-500" />
          ) : (
            <FaTimes className="text-xl text-red-500" />
          )}
        </div>
      </div>

      <div className="bg-white px-12 py-4 flex items-center justify-center gap-6 md:gap-0 md:justify-evenly flex-wrap md:flex-nowrap text-center">
        <div className="">
          <p
            style={{
              fontSize: "0.875rem",
              lineHeight: "1.25rem",
              textTransform: "uppercase",
              color: "#989898",
            }}
          >
            Month
          </p>
          <p style={{ color: "#061D53" }}>{month}</p>
        </div>
        <div className="">
          <p
            style={{
              fontSize: "0.875rem",
              lineHeight: "1.25rem",
              textTransform: "uppercase",
              color: "#989898",
            }}
          >
            Year
          </p>
          <p style={{ color: "#061D53" }}>{year}</p>
        </div>
        <div className="">
          <p
            style={{
              fontSize: "0.875rem",
              lineHeight: "1.25rem",
              textTransform: "uppercase",
              color: "#989898",
            }}
          >
            Deposit
          </p>
          <p style={{ color: "#061D53" }}>{paidBillInBDT} BDT</p>
        </div>
        <div className="">
          <p
            style={{
              fontSize: "0.875rem",
              lineHeight: "1.25rem",
              textTransform: "uppercase",
              color: "#989898",
            }}
          >
            Bill
          </p>
          <p style={{ color: "#061D53" }}>{totalBillInBDT} BDT</p>
        </div>
      </div>

      <div className="bg-white px-12 pb-2 grid grid-cols-3 place-items-center gap-5 text-center">
        <div className="">
          <p
            style={{
              fontSize: "0.875rem",
              lineHeight: "1.25rem",
              textTransform: "uppercase",
              color: "#989898",
            }}
          >
            Breakfast
          </p>
          <p style={{ color: "#061D53" }}>{totalBreakfast}</p>
        </div>
        <div className="">
          <p
            style={{
              fontSize: "0.875rem",
              lineHeight: "1.25rem",
              textTransform: "uppercase",
              color: "#989898",
            }}
          >
            Lunch
          </p>
          <p style={{ color: "#061D53" }}>{totalLunch}</p>
        </div>
        <div className="">
          <p
            style={{
              fontSize: "0.875rem",
              lineHeight: "1.25rem",
              textTransform: "uppercase",
              color: "#989898",
            }}
          >
            Dinner
          </p>
          <p style={{ color: "#061D53" }}>{totalDinner}</p>
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
                <p
                  style={{
                    fontSize: "0.875rem",
                    lineHeight: "1.25rem",
                    textTransform: "uppercase",
                    color: "#989898",
                  }}
                >
                  {crg.note}
                </p>
                <p style={{ color: "#061D53" }}>{crg.amount} BDT</p>
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
      <div
        style={{
          display: "flex",
          paddingTop: "0.75rem",
          paddingBottom: "0.75rem",
          paddingRight: "1rem",
          gap: "1rem",
          justifyContent: "flex-end",
          alignItems: "center",
          borderBottomRightRadius: "0.75rem",
          borderBottomLeftRadius: "0.75rem",
          borderWidth: "1px",
          borderColor: "#2563EB",
          "@media (min-width: 768px)": { paddingRight: "2.5rem" },
        }}
      >
        {status == "initiated" ? (
          <p className=" text-blue-600 font-bold">Not Calculated</p>
        ) : paidBillInBDT == totalBillInBDT ? (
          <p className=" text-green-600 font-bold">Paid</p>
        ) : (
          <>
            {isManageable && (
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
            )}
            <p style={{ fontWeight: 700, color: "#DC2626" }}>Due</p>
          </>
        )}
        {status == "calculated" && paidBillInBDT != totalBillInBDT && (
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
