"use client";
import { convertCamelCaseToCapitalized } from "@/utils/camelToCapitalize";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const BookingCard = ({ booking, refetch = () => {} }) => {
  const [transaction, setTransaction] = useState(null);
  useEffect(() => {
    if (!booking?.transactionId) return;
    axios
      .get(`/api/prebooking?transactionId=${booking.transactionId}`)
      .then((data) => {
        setTransaction(data.data.transaction);
      })
      .catch();
  }, [booking]);

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!booking?._id) return;
    const swalRes = await Swal.fire({
      title: "Do you want to Delete?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#1493EA",
      cancelButtonColor: "#EF4444",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      background: "#141E30",
      color: "#fff",
    });
    if (!swalRes.isConfirmed) {
      return;
    }
    setIsDeleting(true);
    try {
      const { data } = await axios.delete(`/api/prebooking?_id=${booking._id}`);
      if (!data.success) throw new Error(data.msg);
      refetch();
      toast.success(data.msg);
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error(error?.response?.data?.msg || error?.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const makeResponded = async (id) => {
    const swalRes = await Swal.fire({
      title: "Do you want to change the status?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#1493EA",
      cancelButtonColor: "#EF4444",
      confirmButtonText: "Proceed",
      cancelButtonText: "Cancel",
      background: "#141E30",
      color: "#fff",
    });
    if (!swalRes.isConfirmed) {
      return;
    }
    try {
      const { data } = await axios.put("/api/prebooking", { id });
      if (!data.success) throw new Error(data.msg);
      refetch();
      toast.success(data.msg);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="border border-gray-700 p-6 rounded-lg shadow-lg bg-gray-900 text-white">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-700 pb-4 mb-4">
        <div className="space-y-2 flex-1">
          <h3 className="text-2xl font-bold">{booking?.name}</h3>
          <p className="text-gray-400">📧 Email: {booking?.email}</p>
          <p className="text-gray-400">📞 Phone: {booking?.phoneNumber}</p>
          <p className="text-gray-400">
            🔗 Source: {convertCamelCaseToCapitalized(booking?.source)}
          </p>
          <p className="text-gray-400">
            ⏳ Booking Time: {new Date(booking?.bookingTime).toLocaleString()}
          </p>
          <p className="text-gray-400">📅 Check-In Month: {booking?.checkIn}</p>
        </div>

        {/* Payment & Response Status */}
        <div className="flex flex-col space-y-2 md:ml-6">
          <span
            className={`px-3 py-1 text-sm font-semibold rounded-full ${
              booking?.isPaid
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {booking?.isPaid ? "✅ Paid" : "❌ Not Paid"}
          </span>
          <span
            onClick={() => makeResponded(booking._id)}
            className={`px-3 py-1 text-sm font-semibold rounded-full cursor-pointer ${
              booking?.isResponded
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {booking?.isResponded ? "📩 Responded" : "📭 Not Responded"}
          </span>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`mt-2 px-3 py-1 rounded-full active:scale-90 duration-300 text-sm font-semibold transition ${
              isDeleting
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {isDeleting ? "Deleting..." : "🗑 Delete"}
          </button>
        </div>
      </div>

      {/* Transaction Details */}
      {transaction && (
        <div className="border border-gray-700 p-4 rounded-lg bg-gray-800 mb-4">
          <h4 className="text-lg font-semibold underline mb-2">
            💰 Transaction Details
          </h4>
          <p className="text-gray-400">📝 Note: {transaction?.note}</p>
          <p className="text-gray-400">
            📅 Date: {transaction?.transactionDate}
          </p>
          <p className="text-gray-400">🔑 ID: {transaction?.transactionId}</p>
          <h5 className="text-md font-semibold underline mt-2">💵 Payments:</h5>
          {transaction?.payments?.map((p, i) => (
            <p key={i} className="text-gray-400">
              {p.name}: {p.value}
            </p>
          ))}
        </div>
      )}

      {/* Beds Information */}
      <div className="border border-gray-700 p-4 rounded-lg bg-gray-800">
        <h4 className="text-lg font-semibold underline text-center mb-2">
          🛏️ Beds Assigned
        </h4>
        <ul className="list-disc pl-6 space-y-1">
          {booking?.beds.map((bed, index) => (
            <li key={index} className="text-gray-400">
              <span className="font-semibold">🏢 Building:</span>{" "}
              {bed.roomBuilding} |
              <span className="font-semibold"> 🏠 Floor:</span> {bed.roomFloor}{" "}
              |<span className="font-semibold"> 🏡 Room:</span>{" "}
              {convertCamelCaseToCapitalized(bed.roomName)} |
              <span className="font-semibold"> 🛏 Bed No:</span>{" "}
              {convertCamelCaseToCapitalized(bed.bedNo)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BookingCard;
