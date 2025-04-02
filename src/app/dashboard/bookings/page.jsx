"use client";
import PreLoader from "@/Components/PreLoader/PreLoader";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/providers/ContextProvider";
import BookingComponent from "./BookingComponent";
import { convertCamelCaseToCapitalized } from "@/utils/camelToCapitalize";
import BookingCard from "./BookingCard";

const ManagerAllBookingsComponent = () => {
  const { user } = useContext(AuthContext);
  const route = useRouter();
  const searchParams = useSearchParams();

  const roomId = searchParams.get("roomId");
  const bedNo = searchParams.get("bedNo");
  const roomFloor = searchParams.get("roomFloor");
  const roomName = searchParams.get("roomName");
  const roomBuilding = searchParams.get("roomBuilding");

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!roomId || !bedNo || !roomFloor || !roomName || !roomBuilding)
      route.push("/dashboard/bookings");
  }, [roomId, bedNo, roomFloor, roomName, roomBuilding, route]);

  const {
    data: bookings = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["All Bookings", "Manager Only", user?._id],
    queryFn: async () => {
      const { data } = await axios.patch(`/api/booking`);
      if (data.success) {
        return data.bookings.reverse();
      } else {
        return [];
      }
    },
    enabled: user?._id ? true : false,
  });

  // Filter bookings based on search term
  const filteredBookings = bookings.filter((booking) =>
    new RegExp(searchTerm, "i").test(booking?.name)
  );

  if (!user || isLoading) return <PreLoader />;
  if (user?.success == false) return route.push("/signin");
  if (user.role != "manager") return route.push("/");

  return (
    <>
      {roomId && bedNo && roomFloor && roomName && roomBuilding && (
        <BookingComponent
          data={{
            roomId,
            bedNo,
            roomFloor,
            roomName,
            roomBuilding,
          }}
          show={true}
          refetch={refetch}
        />
      )}
      <div className="min-h-full p-4 bg-dashboard text-slate-100">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-4">
          <p className="text-center font-semibold text-2xl dark:text-white">
            Bookings
          </p>
          <input
            type="text"
            placeholder="Search by Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 rounded-md bg-gray-800 text-white outline-none"
          />
        </div>
        {filteredBookings?.length == 0 && !isLoading && (
          <p className="text-center font-semibold text-slate-300">
            No Bookings
          </p>
        )}
        <div className="flex flex-col gap-10">
          {filteredBookings.map((booking, i) => (
            <BookingCard refetch={refetch} booking={booking} key={i} />
          ))}
        </div>
      </div>
    </>
  );
};

export default ManagerAllBookingsComponent;
