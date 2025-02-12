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
    <div className="border p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div className="space-y-2 flex-1">
          <h3 className="text-xl font-bold">{booking?.name}</h3>
          <p className="text-gray-300">Email: {booking?.email}</p>
          <p className="text-gray-300">Phone: {booking?.phoneNumber}</p>
          <p className="text-gray-300">
            Source: {convertCamelCaseToCapitalized(booking?.source)}
          </p>
          <p className="text-gray-300">
            Booking Time: {new Date(booking?.bookingTime).toLocaleString()}
          </p>
          <p className="text-gray-300">CheckIn Month: {booking?.checkIn}</p>
          <p
            className={`text-sm font-semibold ${
              booking?.isPaid ? "text-green-600" : "text-red-600"
            }`}
          >
            {booking?.isPaid ? "Paid" : "Not Paid"}
          </p>
          <p
            onClick={() => makeResponded(booking._id)}
            className={`text-sm font-semibold underline ${
              booking?.isResponded
                ? "text-green-600 cursor-pointer"
                : "text-red-600 cursor-pointer"
            }`}
          >
            {booking?.isResponded ? "Responded" : "Not Responded"}
          </p>
        </div>
        {transaction && (
          <div className="flex-1">
            <p className="text-gray-300">Note: {transaction?.note}</p>
            <p className="text-gray-300">
              Transaction Date: {transaction?.transactionDate}
            </p>
            <p className="text-gray-300">
              Transaction ID: {transaction?.transactionId}
            </p>
            <p className="text-gray-300 font-semibold underline">Payments:</p>
            {transaction?.payments?.map((p, i) => (
              <p key={i} className="text-gray-300">
                {p.name}: {p.value}
              </p>
            ))}
          </div>
        )}
      </div>
      <div className="mt-2">
        <h4 className="text-md underline font-semibold text-center">Beds:</h4>
        <ul className="list-disc pl-4">
          {booking?.beds.map((bed, index) => (
            <li
              key={index}
              className="text-gray-300 flex items-center justify-center gap-4"
            >
              <span>Building: {bed.roomBuilding}</span>
              <span>Floor: {bed.roomFloor}</span>
              <span>
                Room Name: {convertCamelCaseToCapitalized(bed.roomName)}
              </span>
              <span>Bed No: {convertCamelCaseToCapitalized(bed.bedNo)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BookingCard;
