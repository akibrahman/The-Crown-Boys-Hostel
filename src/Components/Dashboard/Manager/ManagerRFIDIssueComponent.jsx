"use client";

import PreLoader from "@/Components/PreLoader/PreLoader";
import { AuthContext } from "@/providers/ContextProvider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { IoSearchOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";

const ManagerRFIDIssueComponent = () => {
  const route = useRouter();
  const { user } = useContext(AuthContext);
  const [loading, setloading] = useState(true);
  const { data: rfids, refetch: rfidsRefetch } = useQuery({
    queryKey: ["rfids", "manager"],
    queryFn: async () => {
      try {
        const { data } = await axios.get("/api/rfid");
        if (data.success) {
          setloading(false);
          console.log(data.rfids);
          return data.rfids;
        } else {
          setloading(false);
          return [];
        }
      } catch (error) {
        console.log(error);
      }
    },
    enabled: user && user?.role == "manager" ? true : false,
  });
  const [selectedUser, setSelectedUser] = useState("");
  const [clientName, setClientName] = useState("");
  const { data: clients, refetch: clientRefetch } = useQuery({
    queryKey: ["clients", "manager", user?._id, clientName, "RFID_Section"],
    queryFn: async ({ queryKey }) => {
      const { data } = await axios.get(
        `/api/clients/getclients?id=${queryKey[2]}&onlyApproved=1&clientName=${queryKey[3]}`
      );
      const array = data.clients;
      return array;
    },
    enabled: user?._id && user?.role == "manager" ? true : false,
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
  const [isIssuing, setisIssuing] = useState([false, ""]);
  const issueCard = async (id, action) => {
    if (!action) return toast.error("Invalid action!");
    setisIssuing([true, id]);
    try {
      const { data } = await axios.put(`/api/rfid`, {
        rfidId: id,
        userId: selectedUser,
        action,
      });
      if (data.success) {
        await rfidsRefetch();
        toast.success(data.msg);
      } else {
        toast.error(data.msg);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.msg);
    } finally {
      setSelectedUser("");
      setisIssuing([false, ""]);
    }
  };
  if (!user) return <PreLoader />;
  if (user?.success == false || user?.role != "manager") return route.push("/");
  return (
    <div className="dark:bg-gradient-to-r dark:from-primary dark:to-secondary bg-gradient-to-r from-primary to-secondary dark:text-stone-300 text-stone-300">
      <p className="text-center py-5 text-xl">RFID Issue</p>
      <button
        onClick={async () => {
          try {
            const { data } = await axios.post("/api/rfid", {
              cardId: "EE FF GG HH",
            });
            if (data.success) {
              await rfidsRefetch();
              toast.success("Card created successfully");
            } else {
              toast.error(data.msg);
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
      <div className="grid grid-cols-3 gap-4">
        {/*//! All Cards  */}
        <div className="col-span-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center mt-20">
              <CgSpinner className="text-4xl animate-spin text-blue-500" />
            </div>
          ) : rfids && rfids.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 px-10">
              {rfids.map((rfid) => (
                <div
                  className="border border-blue-500 px-6 py-4"
                  key={rfid._id}
                >
                  <div className="flex items-center gap-4">
                    <Image
                      alt={`Profile picture of `}
                      src={
                        rfid.isIssued
                          ? rfid.profilePicture
                          : "/images/no-user.png"
                      }
                      height={40}
                      width={40}
                      className="rounded-full aspect-square"
                    />
                    <div className="">
                      <p>
                        <span className="w-[100px] inline-block">
                          RFID UID:
                        </span>
                        <span className="font-semibold text-blue-500 ml-4">
                          {rfid.cardId}
                        </span>
                      </p>
                      <p>
                        <span className="w-[100px] inline-block">
                          User Name:
                        </span>
                        {/* <span className="font-semibold text-blue-500 ml-4">
                          {new Date(rfid.createdAt).toLocaleString()}
                        </span> */}
                        <span className="font-semibold text-blue-500 ml-4">
                          {rfid.isIssued ? rfid.username : "------------"}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-5">
                    {!rfid.isIssued ? (
                      <button
                        onClick={() => issueCard(rfid._id, "issue")}
                        className="bg-green-500 disabled:bg-stone-400 flex items-center gap-4 disabled:pointer-events-none text-white px-4 py-0.5 rounded-full duration-300 active:scale-90 select-none"
                        disabled={selectedUser ? false : true}
                      >
                        Issue
                        {isIssuing[0] == true && isIssuing[1] == rfid._id && (
                          <CgSpinner className="text-lg text-white animate-spin" />
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => issueCard(rfid._id, "remove")}
                        className="bg-red-500 flex items-center gap-4 text-white px-4 py-0.5 rounded-full duration-300 active:scale-90 select-none"
                      >
                        Remove
                        {isIssuing[0] == true && isIssuing[1] == rfid._id && (
                          <CgSpinner className="text-lg text-white animate-spin" />
                        )}
                      </button>
                    )}
                    {rfid.isIssued || (
                      <div
                        onClick={() => deleteRFID(rfid._id)}
                        className="w-8 h-8 rounded-full flex items-center justify-center duration-300 active:scale-90 bg-[rgba(255,0,0,0.2)] cursor-pointer"
                      >
                        <MdDelete className="text-red-500" />
                      </div>
                    )}
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
        {/*//! All Users !  */}
        <div className="h-[380px] overflow-x-hidden overflow-y-scroll px-3 flex flex-col items-center gap-4 relative">
          <div className=" pb-2 bg-transparent w-[110%] flex justify-center sticky top-0">
            <div className="relative">
              <input
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Search by name"
                type="text"
                className="w-80 px-4 pl-12 py-3 rounded-full dark:text-white font-semibold dark:bg-stone-800 bg-stone-300 focus:outline-none"
              />
              <IoSearchOutline className="absolute top-1/2 -translate-y-1/2 left-4 text-lg" />
            </div>
          </div>

          {clientName && !clients ? (
            <p className="mt-4 flex items-center gap-1 font-semibold">
              <CgSpinner className="animate-spin text-lg" />
              Loading...
            </p>
          ) : (
            clients?.map((client, i) => (
              <div
                onClick={() => {
                  if (client._id == selectedUser) setSelectedUser("");
                  else setSelectedUser(client._id);
                }}
                key={client._id}
                className={`border px-6 py-3 rounded-lg flex flex-col md:flex-row items-center select-none w-full justify-between gap-4 cursor-pointer duration-300 active:scale-90 ${
                  client._id == selectedUser ? "border-red-700" : "border-white"
                }`}
              >
                <p>{i + 1}</p>
                <Image
                  alt={`Profile picture of ${client.username}`}
                  src={client.profilePicture}
                  height={40}
                  width={40}
                  className="rounded-full aspect-square"
                />
                <div className="md:w-[900px] md:overflow-x-hidden text-center md:text-left">
                  <p>{client.username}</p>
                  <p className="text-sm">{client.email}</p>
                </div>
              </div>
            ))
          )}
        </div>
        {/*//! !  */}
      </div>
    </div>
  );
};

export default ManagerRFIDIssueComponent;
