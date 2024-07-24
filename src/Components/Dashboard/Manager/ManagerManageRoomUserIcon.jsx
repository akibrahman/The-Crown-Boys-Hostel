import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";

const ManagerManageRoomUserIcon = ({ selectSeat, bedNo, room }) => {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const getPicture = async (bedNo) => {
      const { data } = await axios.get(
        `/api/room?name=${bedNo.substring(0, 2)}&floor=${room.floor}`
      );
      const userId = data.rooms[0].beds.find((bed) => bed.bedNo == bedNo).user;
      if (!userId) return setImageUrl("/images/no-user.png");
      const { data: userData } = await axios.get(
        `/api/clients/getclient?id=${userId}`
      );
      setImageUrl(userData.client.profilePicture);
    };
    getPicture(bedNo);
  }, [selectSeat, bedNo, room]);

  if (imageUrl) {
    return (
      <Image
        width={40}
        height={40}
        src={imageUrl}
        alt={`Seat No ${bedNo}`}
        onClick={() => {
          selectSeat(bedNo);
        }}
        className={`duration-300 hover:scale-105 active:scale-90 cursor-pointer aspect-square rounded-full`}
      />
    );
  } else {
    return (
      <CgSpinner className="text-center text-xl text-dashboard animate-spin" />
    );
  }
};

export default ManagerManageRoomUserIcon;
