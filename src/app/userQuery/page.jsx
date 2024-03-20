"use client";

import { AuthContext } from "@/providers/ContextProvider";
import axios from "axios";
import { useContext } from "react";

const UserQuery = () => {
  const { user } = useContext(AuthContext);
  return (
    <div className="max-h-screen">
      <p className="text-center font-semibold text-2xl">User Query</p>
      <div className="flex items-center justify-center gap-4 my-14">
        <p className="text-yellow-500 font-semibold">Select User : </p>
        <select
          name=""
          className="px-5 py-2 rounded-md bg-stone-700 cursor-pointer"
          id=""
        >
          <option value="">Select User</option>
          <option value="">Akib Rahman</option>
          <option value="">Akib Rahman 1</option>
          <option value="">Akib Rahman 2</option>
          <option value="">Akib Rahman 3</option>
        </select>
        <button
          onClick={async () => {
            const { data } = await axios.get(
              `/api/clients/getclients?id=${user?._id}`
            );
            console.log(">>>", data);
          }}
          className="bg-yellow-500 px-4 py-2 rounded-md duration-300 font-semibold text-stone-800 active:scale-90"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default UserQuery;
