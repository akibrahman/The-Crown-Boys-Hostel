"use client";
import PreLoader from "@/Components/PreLoader/PreLoader";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const ManagerAllBookingsComponent = ({ user }) => {
  const route = useRouter();
  const { data: allBookings } = useQuery({
    queryKey: ["All Bookings", "Manager Only", user?._id],
    queryFn: async () => {
      const { data } = await axios.patch(`/api/booking`);
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
    <div className="min-h-full p-10 bg-dashboard text-slate-100">
      <p className="text-center font-semibold text-2xl dark:text-white">
        Bookings
      </p>
      {/* <button
        // disabled
        onClick={async () => {
          const { data } = await axios.get("/api/cronjob/cronjob", {
            headers: { Authorization: "Bearer 1234567890" },
          });
          if (data.success) {
            console.log(data.data);
            toast.success("Job Done");
          } else toast.error("Job Error");
        }}
        className="bg-green-500 text-white px-4 py-2 rounded-full font-semibold duration-300 active:scale-90 "
      >
        Cron Job
      </button> */}
    </div>
  );
};

export default ManagerAllBookingsComponent;
