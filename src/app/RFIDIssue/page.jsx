"use client";

import { AuthContext } from "@/providers/ContextProvider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { MdDelete } from "react-icons/md";

const RFIDIssue = () => {
  const { user } = useContext(AuthContext);
  const [loading, setloading] = useState(true);
  const { data: rfids, refetch: rfidsRefetch } = useQuery({
    queryKey: ["rfids", "manager"],
    queryFn: async () => {
      const { data } = await axios.get("/api/rfid");
      if (data.success) {
        setloading(false);
        return data.rfids;
      } else {
        setloading(false);
        return [];
      }
    },
    enabled: user && user?.role == "manager" ? true : false,
  });
  const deleteRFID = async (id) => {
    try {
      const { data } = await axios.delete(`/api/rfid?cardId=${id}`);
      if (data.success) {
        await rfidsRefetch();
        toast.success("Deleted successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.msg);
    }
  };
  const issueCard = async (id) => {
    toast.success("Comming soon !");
  };
  return (
    <div className="min-h-screen pb-20 dark:bg-gradient-to-r dark:from-primary dark:to-secondary bg-gradient-to-r from-primary to-secondary dark:text-stone-300 text-stone-300">
      <p className="text-center py-5 text-lg">RFID Issue</p>
      <button
        onClick={async () => {
          try {
            const { data } = await axios.post("/api/rfid", {
              cardId: "EE FF GG HH",
              createdAt: new Date().toISOString(),
            });
            if (data.success) {
              await rfidsRefetch();
              toast.success("Card created successfully"); //Optimox
            }
          } catch (error) {
            console.log(error);
            toast.error(error.response.data.msg);
          }
        }}
        className="block mx-auto my-4 px-4 py-1 duration-300 bg-green-500 text-white active:scale-90"
      >
        create Card
      </button>
      <div className="">
        {loading ? (
          <div className="flex flex-col items-center justify-center mt-20">
            <CgSpinner className="text-4xl animate-spin text-blue-500" />
          </div>
        ) : rfids && rfids.length > 0 ? (
          <div className="grid grid-cols-3 gap-4 px-10">
            {rfids.map((rfid) => (
              <div className="border border-blue-500 px-6 py-4" key={rfid._id}>
                <p>
                  <span className="w-[100px] inline-block">RFID UID:</span>
                  <span className="font-semibold text-blue-500 ml-4">
                    {rfid.cardId}
                  </span>
                </p>
                <p>
                  <span className="w-[100px] inline-block">Scanned At:</span>
                  <span className="font-semibold text-blue-500 ml-4">
                    {new Date(rfid.createdAt).toLocaleString()}
                  </span>
                </p>
                <div className="mt-4 flex items-center gap-5">
                  <button
                    onClick={() => issueCard(rfid._id)}
                    className="bg-green-500 text-white px-4 py-0.5 rounded-full duration-300 active:scale-90 select-none"
                  >
                    Issue
                  </button>
                  <div
                    onClick={() => deleteRFID(rfid._id)}
                    className="w-8 h-8 rounded-full flex items-center justify-center duration-300 active:scale-90 bg-[rgba(255,0,0,0.2)] cursor-pointer"
                  >
                    <MdDelete className="text-red-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center mt-20">
            <p>No scanned card !</p>
            <p>Scan a new card to get here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RFIDIssue;
