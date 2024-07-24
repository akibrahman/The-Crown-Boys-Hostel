import PreLoader from "@/Components/PreLoader/PreLoader";
import ManagerManageRoomRoomSketch from "@/Components/RoomSketch/ManagerManageRoomRoomSketch";
import { convertCamelCaseToCapitalized } from "@/utils/camelToCapitalize";
import Image from "next/image";
import React, { useState } from "react";
import Modal from "react-modal";
import ManagerManageRoomBedData from "./ManagerManageRoomBedData";

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

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => {
        setSelectedBed(null);
        onRequestClose();
      }}
      style={customStyles}
    >
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
              src={room.sketch.src}
              className="w-full"
            />
            <ManagerManageRoomRoomSketch
              name={room.name}
              room={room}
              selectedBed={selectedBed}
              setSelectedBed={setSelectedBed}
            />
          </div>
          {selectedBed ? (
            <ManagerManageRoomBedData
              selectedBed={selectedBed}
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
