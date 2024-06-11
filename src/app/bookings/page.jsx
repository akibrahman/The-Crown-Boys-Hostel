"use client";
import PreLoader from "@/Components/PreLoader/PreLoader";
import { AuthContext } from "@/providers/ContextProvider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useContext } from "react";

const Bookings = () => {
  const { user } = useContext(AuthContext);
  const route = useRouter();
  const { data: allBookings } = useQuery({
    queryKey: ["All Bookings", "Manager Only", user?._id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/booking`);
      if (data.success) {
        return data.bookings;
      } else {
        return [];
      }
    },
    enabled: user?._id ? true : false,
  });
  console.log(allBookings);
  if (!user) return <PreLoader />;
  if (user?.success == false) return route.push("/signin");
  if (user.role != "manager") return route.push("/");
  return (
    <div className="min-h-screen p-10 dark:bg-gradient-to-r dark:from-primary dark:to-secondary">
      <p className="text-center font-semibold text-2xl dark:text-white">
        All Bookings
      </p>
    </div>
  );
};

export default Bookings;
