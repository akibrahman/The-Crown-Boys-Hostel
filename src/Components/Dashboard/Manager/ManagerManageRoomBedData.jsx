import { convertCamelCaseToCapitalized } from "@/utils/camelToCapitalize";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import Select from "react-select";
import { customStylesForReactSelect } from "@/utils/reactSelectCustomStyle";

const ManagerManageRoomBedData = ({
  selectedBed,
  room,
  refetch,
  users,
  setSelectedBed,
}) => {
  const route = useRouter();

  const [isBooked, setIsBooked] = useState(selectedBed[1].isBooked);
  const [userRent, setUserRent] = useState(selectedBed[1].userRent);
  const [user, setUser] = useState(selectedBed[1].user);
  const [loading, setLoading] = useState(false);

  const saveBed = async () => {
    if (!userRent) {
      toast.error("Enter rent");
      return;
    }
    if (user != selectedBed[1].user) {
      if (user) {
        // First Check
        setLoading(true);
        const { data } = await axios.post("/api/roomchecker", {
          userId: user,
          stage: 1,
        });
        if (data.isExists) {
          const result = await Swal.fire({
            title: "Do you want to add user here again?",
            text: `User is already in: Room: ${convertCamelCaseToCapitalized(
              data.roomName
            )} -- bed No: ${convertCamelCaseToCapitalized(
              data.bedNo
            )} -- Floor: ${data.floor}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#1493EA",
            cancelButtonColor: "#EF4444",
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            background: "#141E30",
            color: "#fff",
          });

          if (!result.isConfirmed) {
            setLoading(false);
            return;
          }
        }
        // Second Check
        const { data: data2 } = await axios.post("/api/roomchecker", {
          userId: user,
          stage: 2,
          floor: room.floor,
          roomNumber: room.name,
        });
        if (!data2.success) {
          const result = await Swal.fire({
            title: "Do you want to edit user?",
            text: "Room data is not matching with user's data, First edit user's data",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#1493EA",
            cancelButtonColor: "#EF4444",
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            background: "#141E30",
            color: "#fff",
          });
          if (result.isConfirmed) {
            route.push(`/userDetails/edit/${user}`);
          }
          setLoading(false);
          return;
        }
      }
    }

    setLoading(true);
    const tempBeds = [...selectedBed[0]];
    const tempTargetBed = {
      ...selectedBed[1],
      userRent,
      isBooked,
      user,
    };
    const tempBedsWithoutTragetBed = tempBeds.filter(
      (bed) => bed.bedNo != selectedBed[1].bedNo
    );
    const updatedTempBeds = [...tempBedsWithoutTragetBed, tempTargetBed];
    updatedTempBeds.sort((a, b) => {
      const numA = parseInt(a.bedNo.slice(1));
      const numB = parseInt(b.bedNo.slice(1));
      return numA - numB;
    });
    try {
      const { data } = await axios.patch("/api/room", {
        _id: room._id,
        beds: updatedTempBeds,
      });
      if (data.success) {
        await refetch();
        toast.success(data.msg);
      } else {
        toast.error(data.msg || "Something went wrong, Try again");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.msg || "Something went wrong, Try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full md:w-[50%] relative">
      <FaTimes
        onClick={() => setSelectedBed(null)}
        className="absolute top-4 right-4 text-2xl cursor-pointer bg-white text-gray-600 rounded-full p-1 duration-300 active:scale-90"
      />
      <div className="bg-gray-600 p-4 rounded-md shadow-sm mb-4 flex flex-col items-center justify-center  gap-4">
        <p className="font-semibold text-center text-white">
          {convertCamelCaseToCapitalized(selectedBed[1].bedNo)}
        </p>
        <div className="flex items-center justify-center gap-4">
          <div className="flex flex-col gap-2">
            <label className="block text-white font-semibold">User</label>
            <Select
              className="px-4 py-1.5 rounded-md outline-none font-medium text-gray-500 cursor-pointer w-[350px]"
              onChange={(e) => setUser(e.value)}
              value={
                users
                  .map((u) => ({
                    value: u._id,
                    label: u.username,
                  }))
                  .find((uu) => uu.value === user) || null
              }
              options={users.map((u) => {
                return {
                  value: u._id,
                  label: u.username,
                };
              })}
              styles={customStylesForReactSelect}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="block text-white font-semibold">Rent</label>
            <input
              type="number"
              name="userRent"
              value={userRent}
              onChange={(e) => setUserRent(parseInt(e.target.value))}
              className="px-4 py-1.5 w-full rounded-md outline-none font-medium text-gray-500"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="block text-white font-semibold">Booked</label>
          <input
            type="checkbox"
            name="isBooked"
            checked={isBooked ? true : false}
            onChange={(e) => {
              setIsBooked(!isBooked);
            }}
            className="px-4 py-1.5 w-full rounded-md outline-none font-medium text-gray-500"
          />
        </div>

        <div className="flex flex-col items-center gap-2">
          <label className="block text-white font-semibold">Bed Image</label>

          <Image
            unoptimized={true}
            src={selectedBed[1].image.src}
            alt={`Room ${room.name} Bed ${selectedBed[1].bedNo}`}
            width={100}
            height={130}
            className="w-[100px] h-[130px] rounded-md"
          />
        </div>
        <button
          onClick={saveBed}
          className="px-4 py-1 rounded-md bg-blue-500 text-white font-semibold duration-300 flex items-center justify-center gap-2 active:scale-90"
        >
          Save
          {loading && <CgSpinner className="text-xl animate-spin" />}
        </button>
      </div>
    </div>
  );
};

export default ManagerManageRoomBedData;
