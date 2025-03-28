"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { FaTimes } from "react-icons/fa";
import { FaFaceFrown, FaFaceGrin } from "react-icons/fa6";
import Modal from "react-modal";

const Duplicate = ({
  roomDuplicateModalIsOpen,
  closeRoomDuplicateModal,
  buildings,
}) => {
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      padding: "30",
      // width: "90%",
      // height: "90%",
    },
    overlay: {
      zIndex: 500,
      backgroundColor: "rgba(0,0,0,0.6)",
    },
  };
  const [query, setQuery] = useState({
    name: "",
    building: "",
    selectedRoom: "",
    floor: "",
    floors: [],
    loading: false,
  });
  const { data: room, isLoading } = useQuery({
    queryKey: ["room", "add_room", "duplicate", query.name, query.building],
    queryFn: async ({ queryKey }) => {
      if (queryKey[3] && queryKey[4]) {
        const { data } = await axios.get(
          `/api/room?all=true&name=${queryKey[3]}&building=${queryKey[4]}`
        );
        if (data.success) return data.rooms[0];
        else return undefined;
      } else return undefined;
    },
    enabled: query?.name && query?.building ? true : false,
  });
  const close = () => {
    setQuery({
      name: "",
      building: "",
      selectedRoom: "",
      floor: "",
      floors: [],
      loading: false,
    });
    closeRoomDuplicateModal();
  };
  const handleSubmit = async () => {
    try {
      const floors = query.floors;
      const roomId = query.selectedRoom;
      if (!roomId || !floors || floors.length <= 0)
        return toast.error("Missing Data!");
      setQuery((prev) => ({ ...prev, loading: true }));
      const { data } = await axios.post("/api/room/duplicate", {
        floors,
        roomId,
      });
      if (!data.success) throw new Error(data.msg);
      toast.success(data.msg);
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error(error?.response?.data?.msg || error.message);
    } finally {
      setQuery((prev) => ({ ...prev, loading: false }));
    }
  };
  return (
    <Modal
      isOpen={roomDuplicateModalIsOpen}
      onRequestClose={close}
      style={customStyles}
    >
      {roomDuplicateModalIsOpen && (
        <div className="relative px-6 py-5 text-slate-800">
          <FaTimes
            onClick={close}
            className="text-xl absolute top-4 right-4 cursor-pointer duration-300 active:scale-90"
          />
          <p className="text-xl text-center font-medium text-slate-900">
            Add Same Rooms
          </p>
          <div className="flex items-center justify-center gap-6 mt-4">
            <select
              className="px-4 py-1.5 rounded-md font-medium bg-gray-500 outline-none text-white"
              onChange={(e) =>
                setQuery((prev) => ({ ...prev, building: e.target.value }))
              }
              value={query.building}
            >
              <option value="">Select Buildiing</option>
              {buildings?.map((building) => (
                <option key={building._id} value={building._id}>
                  {building.name}
                </option>
              ))}
            </select>
            <input
              placeholder="Room Name"
              type="text"
              className="px-4 py-1.5 rounded-md font-medium bg-gray-500 outline-none text-white placeholder:text-white"
              onChange={(e) =>
                setQuery((prev) => ({ ...prev, name: e.target.value }))
              }
              value={query.name}
            />
          </div>
          {!query?.name || !query?.building ? (
            <p className="flex items-center justify-center gap-2 font-semibold my-5">
              Enter Queries <FaFaceGrin className="text-xl" />
            </p>
          ) : isLoading ? (
            <p className="flex items-center justify-center gap-2 font-semibold my-5">
              Loading <CgSpinner className="text-xl animate-spin" />
            </p>
          ) : !room ? (
            <p className="flex items-center justify-center gap-2 font-semibold my-5">
              No Room Found <FaFaceFrown className="text-xl" />
            </p>
          ) : (
            <div
              onClick={() =>
                setQuery((prev) => ({ ...prev, selectedRoom: room?._id }))
              }
              className={`flex items-center justify-center gap-4 mt-5 border border-slate-800 py-1 px-3 rounded-full cursor-pointer active:scale-90 duration-300 select-none ${
                query.selectedRoom == room?._id
                  ? "border-double"
                  : "border-dotted"
              }`}
            >
              <Image
                src={room?.image}
                alt={room?.name}
                height="50"
                width="50"
                className="object-cover rounded-full aspect-square"
              />
              <p className="font-semibold">
                {room?.name?.toUpperCase()?.split("")?.join(" ")}
              </p>
              <p className="font-semibold text-sm">{room?.building}</p>
            </div>
          )}
          {query.floors.length > 0 && (
            <p className="flex items-center gap-2 text-sm mt-1">
              Added Floors:
              {query.floors.map((f) => (
                <span>{f}, </span>
              ))}
            </p>
          )}
          {!isLoading &&
            room &&
            query.selectedRoom &&
            room?._id == query.selectedRoom && (
              <select
                className="px-4 py-1.5 font-medium text-gray-500 outline-none border-b-2 cursor-pointer border-dashboard mt-3"
                onChange={(e) => {
                  const selectedFloor = parseInt(e.target.value);
                  if (!selectedFloor || selectedFloor === room?.floor) {
                    return toast.error("Selected room is on this Floor!");
                  }
                  setQuery((prev) => {
                    const newFloors = prev.floors.includes(selectedFloor)
                      ? prev.floors.filter((floor) => floor !== selectedFloor)
                      : [...prev.floors, selectedFloor];
                    return {
                      ...prev,
                      floor: selectedFloor,
                      floors: newFloors,
                    };
                  });
                }}
                value={query.floor}
              >
                <option value="">Select Floor</option>
                <option value="0">Ground Floor</option>
                <option value="1">First Floor</option>
                <option value="2">Second Floor</option>
                <option value="3">Third Floor</option>
                <option value="4">Fourth Floor</option>
                <option value="5">Fifth Floor</option>
                <option value="6">Sixth Floor</option>
                <option value="7">Seventh Floor</option>
                <option value="8">Eighth Floor</option>
                <option value="9">Nineth Floor</option>
                <option value="10">Ninth Floor</option>
                <option value="11">Eleventh Floor</option>
                <option value="12">Twelfth Floor</option>
              </select>
            )}
          <button
            disabled={
              isLoading ||
              !query.selectedRoom ||
              room?._id != query.selectedRoom ||
              query.floors.length <= 0 ||
              query.loading
            }
            onClick={handleSubmit}
            className="bg-dashboard disabled:bg-gray-500 select-none disabled:pointer-events-none text-white py-2 px-4 font-semibold duration-300 active:scale-90 rounded flex items-center justify-center gap-2 mx-auto mt-5"
          >
            Duplicate{" "}
            {query.loading && <CgSpinner className="text-xl animate-spin" />}
          </button>
        </div>
      )}
    </Modal>
  );
};

export default Duplicate;
