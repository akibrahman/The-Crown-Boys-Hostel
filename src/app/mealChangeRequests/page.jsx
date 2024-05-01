"use client";

import PreLoader from "@/Components/PreLoader/PreLoader";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { FaArrowRight, FaTimes } from "react-icons/fa";
import { TiTick } from "react-icons/ti";

const MealChangeRequests = () => {
  const { data: mealRequests, refetch: mealRequestsRefetch } = useQuery({
    queryKey: ["mealRequests", "manager"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/mealrequests/mealrequests`);
      return data;
    },
  });
  console.log(mealRequests);

  const [isDeclining, setIsDeclining] = useState([false, ""]);
  const [isAccepting, setIsAccepting] = useState([false, ""]);

  const decline = async (orderId, reqId) => {
    setIsDeclining([true, reqId]);
    try {
      const { data } = await axios.post("/api/mealrequests/decline", {
        orderId,
        reqId,
      });
      if (data.success) {
        toast.success(data.msg);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.msg);
    } finally {
      await mealRequestsRefetch();
      setIsDeclining([false, ""]);
    }
  };

  if (!mealRequests) return <PreLoader />;
  return (
    <div className="dark:bg-gradient-to-r dark:from-primary dark:to-secondary dark:text-white min-h-screen pb-32">
      <p className="text-center text-xl py-8">Requests of Meal Change</p>
      <div className="w-[90%] mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        {mealRequests.map((req) => (
          <div
            className={`bg-stone-800 rounded-md shadow-inner p-6 relative ${
              !req.isResponded
                ? "shadow-orange-500"
                : req.isAccepted
                ? "shadow-green-500"
                : "shadow-red-500"
            }`}
            key={req._id}
          >
            {req.isResponded || (
              <CgSpinner className="absolute top-4 right-4 animate-spin text-xl text-orange-500" />
            )}
            {req.isResponded && req.isAccepted && (
              <TiTick className="absolute top-4 right-4 text-xl text-green-500" />
            )}
            {req.isResponded && req.isDeclined && (
              <FaTimes className="absolute top-4 right-4 text-xl text-red-500" />
            )}
            <div className="flex gap-4 items-center mb-4">
              <Image
                src={req.user.profilePicture}
                width={50}
                height={50}
                className="rounded-full h-12 w-12"
                alt="Profile p[ictur of the user"
              />
              <div className="">
                <p>{req.user.username}</p>
                <p>{req.user.studentId}</p>
              </div>
            </div>
            <div className="">
              <p>
                Order Date: {req.order.date} - {req.order.month}
              </p>
              <p className="text-center mt-2">Request(s)</p>
              {req?.breakfast ? (
                <div className="flex items-center gap-2">
                  <span>{req.breakfast && "Breakfast:"}</span>
                  <div className="flex items-center gap-1">
                    <span>{req.order.breakfast ? "On" : "Off"}</span>
                    <FaArrowRight />
                    <span>{!req.order.breakfast ? "On" : "Off"}</span>
                  </div>
                </div>
              ) : (
                <br />
              )}
              {req?.lunch ? (
                <div className="flex items-center gap-2">
                  <span>{req.lunch && "Lunch:"}</span>
                  <div className="flex items-center gap-1">
                    <span>{req.order.lunch ? "On" : "Off"}</span>
                    <FaArrowRight />
                    <span>{!req.order.lunch ? "On" : "Off"}</span>
                  </div>
                </div>
              ) : (
                <br />
              )}
              {req?.dinner ? (
                <div className="flex items-center gap-2">
                  <span>{req.dinner && "Dinner:"}</span>
                  <div className="flex items-center gap-1">
                    <span>{req.order.dinner ? "On" : "Off"}</span>
                    <FaArrowRight />
                    <span>{!req.order.dinner ? "On" : "Off"}</span>
                  </div>
                </div>
              ) : (
                <br />
              )}
              <br />
              <p>
                Status :{" "}
                {req.isResponded === false
                  ? "Pending"
                  : req.isAccepted
                  ? "Accepted"
                  : "Declined"}
              </p>
              <p>Reason:</p>
              <p className="text-blue-500 underline h-[80px] overflow-y-scroll">
                {req.reason}
              </p>
              {!req.isResponded ? (
                <div className="py-6 flex items-center justify-around">
                  <button className="px-4 py-1 bg-green-500 text-white font-semibold duration-300 active:scale-90">
                    Accept
                  </button>
                  <button
                    onClick={() => decline(req.order._id, req._id)}
                    className="px-4 py-1 bg-red-500 text-white font-semibold duration-300 flex items-center gap-2 active:scale-90"
                  >
                    Decline{" "}
                    {isDeclining[0] && isDeclining[1] == req._id && (
                      <CgSpinner className="text-xl animate-spin" />
                    )}
                  </button>
                </div>
              ) : req.isAccepted ? (
                <p className="py-6 text-center font-semibold text-green-500">
                  Accepted
                </p>
              ) : (
                <p className="py-6 text-center font-semibold text-red-500">
                  Declined
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealChangeRequests;
