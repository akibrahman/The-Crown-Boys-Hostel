import PreLoader from "@/Components/PreLoader/PreLoader";
import ManagerManageRoomRoomSketch from "@/Components/RoomSketch/ManagerManageRoomRoomSketch";
import { convertCamelCaseToCapitalized } from "@/utils/camelToCapitalize";
import Image from "next/image";
import React, { useState } from "react";
import Modal from "react-modal";
import ManagerManageRoomBedData from "./ManagerManageRoomBedData";
import { CgSpinner } from "react-icons/cg";
import { FaTimes } from "react-icons/fa";

const ManagerManageRoom = ({
  isOpen,
  onRequestClose,
  room = null,
  refetch,
  users,
}) => {
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#1F2937",
      // border: "1px solid #EAB308",
      padding: "0",
      width: "90%",
      // overflow: "scroll",
      height: "90%",
    },
    overlay: {
      zIndex: 500,
      backgroundColor: "rgba(0,0,0,0.5)",
    },
  };

  const [selectedBed, setSelectedBed] = useState(null);
  const [selectedBedFetching, setSelectedBedFetching] = useState(false);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => {
        setSelectedBed(null);
        onRequestClose();
      }}
      style={customStyles}
    >
      <FaTimes
        onClick={() => {
          setSelectedBed(null);
          onRequestClose();
        }}
        className="absolute top-4 right-4 text-2xl cursor-pointer bg-white text-gray-600 rounded-full p-1 duration-300 active:scale-90"
      />
      <p className="text-center font-semibold text-slate-100 underline py-3">
        Room Sketch - {convertCamelCaseToCapitalized(room?.name)}
      </p>
      {room ? (
        <div className="flex flex-col md:flex-row items-center justify-center gap-10">
          <div className="w-full md:w-[35%] relative select-none">
            <Image
              height={100}
              width={350}
              alt="Sketch"
              src={room.sketch}
              className="w-full mb-4"
            />
            <ManagerManageRoomRoomSketch
              name={room.name}
              room={room}
              selectedBed={selectedBed}
              setSelectedBed={setSelectedBed}
              setSelectedBedFetching={setSelectedBedFetching}
            />
          </div>
          {selectedBedFetching ? (
            <div className="w-full md:w-[50%]">
              <p className="font-semibold text-gray-500 text-center py-10 flex items-center justify-center gap-2">
                <CgSpinner className="animate-spin text-xl" />
                Loading Bed
              </p>
            </div>
          ) : selectedBed ? (
            <ManagerManageRoomBedData
              selectedBed={selectedBed}
              setSelectedBed={setSelectedBed}
              room={room}
              refetch={refetch}
              users={users}
            />
          ) : (
            <div className="w-full md:w-[50%]">
              <p className="font-semibold text-gray-500 text-center py-10">
                No Bed Selected
              </p>
            </div>
          )}
        </div>
      ) : (
        <PreLoader />
      )}
    </Modal>
  );
};

export default ManagerManageRoom;
