import { CompareTwoArray, hasInvalidValues } from "@/utils/CompareTwoArray";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { FaTimes } from "react-icons/fa";

const ManagerEditTransactionComponent = ({
  setEditTransaction,
  setBgType,
  setSelectedTransaction,
  selectedTransaction,
  setEditTransactionData,
  editTransactionData,
}) => {
  const [selectedNewBill, setSelectedNewBill] = useState(0);
  const [newPayments, setNewPayments] = useState(editTransactionData?.payments);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setNewPayments(editTransactionData.payments);
  }, [editTransactionData]);

  const save = async () => {
    try {
      if (hasInvalidValues(newPayments)) {
        return toast.error("Any has Invalid Value, Try to fix that!");
      }
      let shouldTakeNewPayments = true;
      if (CompareTwoArray(newPayments, editTransactionData.payments)) {
        shouldTakeNewPayments = false;
      }
      if (!shouldTakeNewPayments && !selectedNewBill) {
        return toast("No Change Found");
      }
      setLoading(true);
      const reqData = {
        updateBill: selectedNewBill ? true : false,
        updatePayments: shouldTakeNewPayments,
        newPayments: shouldTakeNewPayments ? newPayments : null,
        newBillId: selectedNewBill || null,
        transactionId: selectedTransaction,
      };
      const { data } = await axios.put("/api/transaction/edit", reqData);
      if (!data.success) throw new Error(data.msg);
      toast.success(data.msg);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.msg || error.message);
    } finally {
      setEditTransaction(false);
      setEditTransactionData(null);
      setSelectedTransaction("");
      setBgType("");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full p-2 md:p-5 bg-dashboard text-slate-100 relative">
      <FaTimes
        className="text-xl to-white absolute top-5 right-4 cursor-pointer"
        onClick={() => {
          setEditTransaction(false);
          setBgType("");
          setSelectedTransaction("");
          setEditTransactionData(null);
        }}
      />
      <p className="text-center font-semibold text-xl md:text-2xl text-white">
        Edit Transaction
      </p>
      {editTransactionData && (
        <div className="mt-5">
          <div className="flex items-center justify-center gap-3">
            <Image
              src={editTransactionData.user.image}
              alt={editTransactionData.user.name}
              height="80"
              width="80"
              className="rounded-full aspect-square"
            />
            <div className="">
              <p>{editTransactionData.user.name}</p>
              <p>{editTransactionData.user.email}</p>
              <p>{editTransactionData.user.month}</p>
            </div>
          </div>
          <p className="text-center font-semibold md:text-2xl text-white my-2">
            Bills
          </p>
          <div className="grid grid-cols-3 gap-4">
            {editTransactionData.bills.map((b) => (
              <div
                className={`px-4 py-2 rounded-md bg-dark-black cursor-pointer active:scale-90 border duration-300 text-white ${
                  selectedNewBill == b._id
                    ? "border-white"
                    : "border-transparent"
                }`}
                key={b._id}
                onClick={() =>
                  setSelectedNewBill(b._id == selectedNewBill ? "" : b._id)
                }
              >
                <p>Month: {b.month}</p>
                <p>Year: {b.year}</p>
              </div>
            ))}
          </div>
          <p className="text-center font-semibold md:text-2xl text-white my-2">
            Payments
          </p>
          <div className="grid grid-cols-3 gap-4">
            {newPayments?.map((p) => (
              <div
                className="px-4 py-2 rounded-md bg-dark-black cursor-pointer duration-300 text-white flex items-center justify-center gap-2"
                key={p._id}
              >
                <p>{p.name}</p>
                <input
                  className="rounded-md px-2 py-1 text-dashboard font-semibold outline-none"
                  type="number"
                  value={newPayments.find((np) => np._id == p._id).value}
                  onChange={(e) => {
                    setNewPayments((prevPayments) => {
                      const targetPayment = prevPayments.find(
                        (np) => np._id == p._id
                      );
                      const otherPayments = prevPayments.filter(
                        (np) => np._id != p._id
                      );
                      return [
                        ...otherPayments,
                        { ...targetPayment, value: parseInt(e.target.value) },
                      ];
                    });
                  }}
                />
              </div>
            ))}
          </div>
          <button
            onClick={save}
            disabled={loading}
            className="px-6 py-1 bg-green-500 text-white font-semibold cursor-pointer active:scale-90 mt-3 mx-auto duration-300 flex items-center justify-center gap-2"
          >
            Save
            {loading && (
              <CgSpinner className="font-semibold text-xl animate-spin" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ManagerEditTransactionComponent;
