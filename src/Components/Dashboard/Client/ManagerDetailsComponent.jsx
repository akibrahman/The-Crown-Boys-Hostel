"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import React from "react";

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
      <div className={`mt-10 py-8 flex flex-col items-center`}>
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
      </div>
    )
  );
};

export default ManagerDetailsComponent;
