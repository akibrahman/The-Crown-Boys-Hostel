"use client";

import { AuthContext } from "@/providers/ContextProvider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";
import toast from "react-hot-toast";

const UserQuery = () => {
  const { user } = useContext(AuthContext);

  //! Current Year in Bangladesh
  const currentDateBangladesh = new Date();
  currentDateBangladesh.setUTCHours(currentDateBangladesh.getUTCHours() + 6);
  const currentYearBangladesh = currentDateBangladesh.getFullYear();

  const { data: myClients } = useQuery({
    queryKey: ["myClients", "userQuery", user?._id],
    queryFn: async ({ queryKey }) => {
      const { data } = await axios.get(
        `/api/clients/getclients?id=${queryKey[2]}`
      );
      if (data.success) {
        return data.clients;
      }
    },
    enabled: user?._id ? true : false,
  });
  //! Search
  const searchUserQuery = async (e) => {
    e.preventDefault();
    const clientId = e.target.clients.value;
    const month = e.target.month.value;
    const year = e.target.year.value;
    if (!clientId || !month || !year) {
      toast.error("Please select all fields!");
      return;
    }
    console.log(month, year);
    const { data } = await axios.post("/api/orders/getorders", {
      userId: clientId,
      month,
      year,
    });
    console.log(data.orders);
  };
  if (!myClients) return <p>Loading</p>;
  return (
    <div className="max-h-screen">
      <p className="text-center font-semibold text-2xl">User Query</p>
      <form
        onSubmit={searchUserQuery}
        className="flex items-center justify-center gap-4 my-14"
      >
        <p className="text-yellow-500 font-semibold">Select User : </p>
        <select
          name="clients"
          className="px-5 py-2 rounded-md bg-stone-700 cursor-pointer"
        >
          <option value="">Select Client</option>
          {myClients.map((client) => (
            <option value={client._id} key={client._id}>
              {client.username}
            </option>
          ))}
        </select>
        <p className="text-yellow-500 font-semibold">Select Month : </p>
        <select
          name="month"
          className="px-5 py-2 rounded-md bg-stone-700 cursor-pointer"
        >
          <option value="">Select Month</option>
          <option value="January">January</option>
          <option value="February">February</option>
          <option value="March">March</option>
          <option value="April">April</option>
          <option value="May">May</option>
          <option value="June">June</option>
          <option value="July">July</option>
          <option value="August">August</option>
          <option value="September">September</option>
          <option value="October">October</option>
          <option value="November">November</option>
          <option value="December">December</option>
        </select>
        <p className="text-yellow-500 font-semibold">Select Year : </p>
        <select
          name="year"
          className="px-5 py-2 rounded-md bg-stone-700 cursor-pointer"
        >
          <option value="">Select Year</option>
          <option value={currentYearBangladesh - 1}>
            {currentYearBangladesh - 1}
          </option>
          <option value={currentYearBangladesh}>{currentYearBangladesh}</option>
          <option value={currentYearBangladesh + 1}>
            {currentYearBangladesh + 1}
          </option>
        </select>
        <button
          type="submit"
          className="bg-yellow-500 px-4 py-2 rounded-md duration-300 font-semibold text-stone-800 active:scale-90"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default UserQuery;
