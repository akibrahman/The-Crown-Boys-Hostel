"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

const ManagerDetailsComponent = ({ user }) => {
  const { data: manager } = useQuery({
    queryKey: ["manager", "user", "profile", user?.manager],
    queryFn: async ({ queryKey }) => {
      try {
        const { data } = await axios.get(
          `/api/users/manager?managerId=${queryKey[3]}`
        );
        return data.manager;
      } catch (error) {
        return null;
      }
    },
    enabled: user?.manager ? true : false,
  });

  if (!manager) return;

  return user.role === "client" && !user.isVerified ? (
    <div className="flex items-center justify-center pl-6 py-8 mt-10">
      <p className="font-semibold shadow-xl shadow-blue-500 px-8 select-none py-2 rounded-full">
        At first verify youself!
      </p>
    </div>
  ) : user.role === "client" && user.isVerified && !user.isClientVerified ? (
    <div className="flex items-center justify-center pl-6 py-8 mt-10">
      <p className="font-semibold shadow-xl shadow-blue-500 px-8 select-none py-2 rounded-full w-max">
        Wait till manager accepts you!
      </p>
    </div>
  ) : (
    user.role === "client" &&
    user.isVerified &&
    user.isClientVerified && (
      <div
        className={`pt-10 py-8 flex flex-col items-center min-h-full bg-dashboard text-slate-100`}
      >
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 10 }}
          className=""
        >
          <Image
            alt={`Profile picture of ${manager.username}`}
            src={manager.profilePicture}
            width={200}
            height={200}
            className="mb-10 rounded-full aspect-square"
          />
          <p className="mb-1 text-blue-500 font-medium text-xl">
            {manager.username}
          </p>
          <p>{manager.email}</p>
          <p>{manager.contactNumber}</p>
        </motion.div>
      </div>
    )
  );
};

export default ManagerDetailsComponent;
