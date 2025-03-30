"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { FaArrowRight, FaTimes } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { TiTick } from "react-icons/ti";
import moment from "moment";
import { AuthContext } from "@/providers/ContextProvider";
import PreLoader from "@/Components/PreLoader/PreLoader";

const Clients = () => {
  const { user } = useContext(AuthContext);

  const [clientName, setClientName] = useState("");
  const [clientsFilter, setClientsFilter] = useState("active");

  const { data: clients, isLoading } = useQuery({
    queryKey: ["clients", "manager", user?._id, clientName, clientsFilter],
    queryFn: async ({ queryKey }) => {
      const { data } = await axios.get(
        `/api/clients/getclients?id=${queryKey[2]}&onlyApproved=0&clientName=${clientName}`
      );
      if (!data.success || data?.clients?.length <= 0) return [];
      let array = [];
      if (queryKey[4] == "active") {
        const temp = data.clients;
        array = temp.filter((t) => !t?.blockDate);
      } else if (queryKey[4] == "block_scheduled") {
        const temp = data.clients;
        array = temp.filter(
          (t) =>
            t.blockDate &&
            !moment(t.blockDate).isBefore(
              moment(
                new Date().toLocaleString("en-US", {
                  timeZone: "Asia/Dhaka",
                }),
                "M/D/YYYY, h:mm:ss A"
              ),
              "day"
            )
        );
      } else if (queryKey[4] == "blocked") {
        const temp = data.clients;
        array = temp.filter(
          (t) =>
            t.blockDate &&
            moment(t.blockDate).isBefore(
              moment(
                new Date().toLocaleString("en-US", {
                  timeZone: "Asia/Dhaka",
                }),
                "M/D/YYYY, h:mm:ss A"
              ),
              "day"
            )
        );
      }
      array.sort((a, b) => a.floor - b.floor);
      array.sort((a, b) => {
        if (a.isClientVerified === b.isClientVerified) {
          return 0;
        } else if (b.isClientVerified) {
          return -1;
        } else {
          return 1;
        }
      });

      return array;
    },
    enabled: user?._id && user?.role == "manager" ? true : false,
  });

  return (
    <div className="px-3 flex flex-col items-center gap-4 py-5  bg-dashboard text-slate-100 min-h-full">
      <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-5 md:pb-2">
        <div className="bg-transparent flex justify-center sticky top-0">
          <div className="">
            <input
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Search by name"
              type="text"
              className="w-80 px-4 pl-12 py-3 rounded-full text-white font-semibold bg-dashboard placeholder:text-white outline-double focus-within:border-none"
            />
            <IoSearchOutline className="absolute top-1/2 -translate-y-1/2 left-4 text-lg text-white" />
          </div>
        </div>
        <select
          className="text-dashboard font-semibold outline-none px-4 py-2 rounded-full cursor-pointer"
          onChange={(e) => setClientsFilter(e.target.value)}
        >
          <option className="cursor-pointer" value="active">
            Active
          </option>
          <option className="cursor-pointer" value="block_scheduled">
            Block Scheduled
          </option>
          <option className="cursor-pointer" value="blocked">
            Blocked
          </option>
        </select>
        <p className="text-xs md:text-sm">{clients?.length}</p>
      </div>

      {(clientName && !clients) || isLoading ? (
        <p className="mt-4 flex items-center gap-1 font-semibold">
          <CgSpinner className="animate-spin text-lg" />
          Loading...
        </p>
      ) : clients?.length > 0 ? (
        clients?.map((client, i) => (
          <div
            key={client._id}
            className={`border px-6 py-5 rounded-lg flex flex-col md:flex-row items-center w-[95%] justify-between gap-4 ${
              client.blockDate &&
              moment(client.blockDate).isBefore(
                moment(
                  new Date().toLocaleString("en-US", {
                    timeZone: "Asia/Dhaka",
                  }),
                  "M/D/YYYY, h:mm:ss A"
                ),
                "day"
              )
                ? "border-red-500"
                : client.blockDate && "border-orange-500"
            }`}
          >
            <p>{i + 1}</p>
            <Image
              alt={`Profile picture of ${client.username} who is a manager`}
              src={
                client.profilePicture == "/__"
                  ? "/images/no-user.png"
                  : client.profilePicture
              }
              height={60}
              width={60}
              className="rounded-full aspect-square"
            />
            {/* <p>{client.floor}</p>
              <p>{client.roomNumber}</p> */}
            <div className="md:w-[900px] md:overflow-x-hidden text-center md:text-left">
              <p>{client.username}</p>
              <p className="text-sm">{client.email}</p>
            </div>
            {client.isVerified === true ? (
              <>
                {client.isClientVerified === true ? (
                  <>
                    <p className="text-green-500 font-semibold flex items-center gap-1">
                      <TiTick className="text-3xl font-normal" />
                      Approved
                    </p>
                    <Link href={`/dashboard/clients/${client.email}`}>
                      <button className="font-semibold flex items-center gap-2 bg-blue-500 text-white px-3 py-1 duration-300 active:scale-90">
                        Details <FaArrowRight />
                      </button>
                    </Link>
                  </>
                ) : (
                  <>
                    <p className="text-red-500 font-semibold flex items-center gap-1">
                      <FaTimes className="text-3xl font-normal" />
                      Disapproved
                    </p>
                    <Link href={`/dashboard/clients/${client.email}`}>
                      <button className="font-semibold flex items-center gap-2 bg-blue-500 text-white px-3 py-1 duration-300 active:scale-90">
                        Details <FaArrowRight />
                      </button>
                    </Link>
                  </>
                )}
              </>
            ) : (
              <>
                <p className="text-red-500 font-semibold flex items-center gap-1">
                  <FaTimes className="text-xl font-normal" />
                  Unverified
                </p>
                <Link href={`/dashboard/clients/${client.email}`}>
                  <button className="font-semibold flex items-center gap-2 bg-blue-500 px-3 py-1 duration-300 active:scale-90">
                    Details <FaArrowRight />
                  </button>
                </Link>
              </>
            )}
          </div>
        ))
      ) : (
        <p className="mt-5 text-center text-slate-200 font-semibold">
          No User Found
        </p>
      )}
    </div>
  );
};

export default Clients;
