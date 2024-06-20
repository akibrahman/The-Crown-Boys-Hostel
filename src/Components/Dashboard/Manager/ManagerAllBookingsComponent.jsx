"use client";
import PreLoader from "@/Components/PreLoader/PreLoader";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

const ManagerAllBookingsComponent = ({user}) => {
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
    <div className="h-full p-10 dark:bg-gradient-to-r dark:from-primary dark:to-secondary">
      <p className="text-center font-semibold text-2xl dark:text-white">
        Bookings
      </p>
    </div>
  );
};

export default ManagerAllBookingsComponent;
