"use client";
import PreLoader from "@/Components/PreLoader/PreLoader";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect } from "react";
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
        <p className="text-center font-semibold mb-4 text-2xl dark:text-white">
          Bookings
        </p>
        {bookings?.length == 0 && !isLoading && (
          <p className="text-center font-semibold text-slate-300">
            No Bookings
          </p>
        )}
        <div className="flex flex-col gap-10">
          {bookings.map((booking, i) => (
            <BookingCard refetch={refetch} booking={booking} key={i} />
          ))}
        </div>
      </div>
    </>
  );
};

export default ManagerAllBookingsComponent;
