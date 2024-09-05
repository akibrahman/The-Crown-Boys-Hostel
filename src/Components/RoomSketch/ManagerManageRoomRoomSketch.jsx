import axios from "axios";
import Image from "next/image";
import toast from "react-hot-toast";
import ManagerManageRoomUserIcon from "../Dashboard/Manager/ManagerManageRoomUserIcon";

const ManagerManageRoomRoomSketch = ({
  name,
  room,
  setSelectedBed,
  setSelectedBedFetching,
}) => {
  const selectSeat = async (bedNo) => {
    setSelectedBed(null);
    setSelectedBedFetching(true);
    try {
      const { data } = await axios.get(
        `/api/room?name=${bedNo.substring(0, 2)}&floor=${room.floor}`
      );
      if (data.success) {
        setSelectedBed([
          data.rooms[0].beds,
          data.rooms[0].beds.find((bed) => bed.bedNo == bedNo),
        ]);
      } else {
        setSelectedBed(null);
        toast.error("Server error, Try again");
      }
    } catch (error) {
      console.log(error);
      setSelectedBed(null);
      toast.error("Server error, Try again");
    } finally {
      setSelectedBedFetching(false);
    }
  };

  if (name == "a3") {
    return (
      <>
        <div className="absolute cursor-pointer top-[30%] left-[26%]">
          <ManagerManageRoomUserIcon
            selectSeat={selectSeat}
            bedNo={"a31"}
            room={room}
          />

          <p className="text-dashboard text-center text-sm font-semibold">
            A 31
          </p>
        </div>
        <div className="absolute cursor-pointer top-[30%] right-[4%]">
          <ManagerManageRoomUserIcon
            selectSeat={selectSeat}
            bedNo={"a32"}
            room={room}
          />

          <p className="text-dashboard text-center text-sm font-semibold">
            A 32
          </p>
        </div>
        <div className="absolute cursor-pointer bottom-[2%] right-[20%] rotate-90">
          <ManagerManageRoomUserIcon
            selectSeat={selectSeat}
            bedNo={"a33"}
            room={room}
          />

          <p className="text-dashboard text-center text-sm font-semibold">
            A 33
          </p>
        </div>
      </>
    );
  } else if (name == "a1") {
    return (
      <>
        <div className="absolute cursor-pointer top-[25%] right-[5%]">
          <ManagerManageRoomUserIcon
            selectSeat={selectSeat}
            bedNo={"a11"}
            room={room}
          />

          <p className="text-dashboard text-center text-sm font-semibold">
            A 11
          </p>
        </div>
        <div className="absolute cursor-pointer left-[33%] bottom-[5%]">
          <ManagerManageRoomUserIcon
            selectSeat={selectSeat}
            bedNo={"a12"}
            room={room}
          />

          <p className="text-dashboard text-center text-sm font-semibold">
            A 12
          </p>
        </div>
      </>
    );
  } else if (name == "a2") {
    return (
      <>
        <div className="absolute cursor-pointer top-[10%] left-[23%]">
          <ManagerManageRoomUserIcon
            selectSeat={selectSeat}
            bedNo={"a21"}
            room={room}
          />

          <p className="text-dashboard text-center text-sm font-semibold">
            A 21
          </p>
        </div>
        <div className="absolute cursor-pointer right-[25%] top-[2%]">
          <ManagerManageRoomUserIcon
            selectSeat={selectSeat}
            bedNo={"a22"}
            room={room}
          />

          <p className="text-dashboard text-center text-sm font-semibold">
            A 22
          </p>
        </div>
        <div className="absolute cursor-pointer right-[25%] top-[60%]">
          <ManagerManageRoomUserIcon
            selectSeat={selectSeat}
            bedNo={"a23"}
            room={room}
          />

          <p className="text-dashboard text-center text-sm font-semibold">
            A 23
          </p>
        </div>
        <div className="absolute cursor-pointer left-[23%] top-[70%]">
          <ManagerManageRoomUserIcon
            selectSeat={selectSeat}
            bedNo={"a24"}
            room={room}
          />

          <p className="text-dashboard text-center text-sm font-semibold">
            A 24
          </p>
        </div>
      </>
    );
  } else if (name == "a4") {
    return (
      <>
        <div className="absolute cursor-pointer top-[40%] left-[5%]">
          <ManagerManageRoomUserIcon
            selectSeat={selectSeat}
            bedNo={"a41"}
            room={room}
          />

          <p className="text-dashboard text-center text-sm font-semibold">
            A 41
          </p>
        </div>
        <div className="absolute cursor-pointer right-[5%] top-[40%]">
          <ManagerManageRoomUserIcon
            selectSeat={selectSeat}
            bedNo={"a42"}
            room={room}
          />

          <p className="text-dashboard text-center text-sm font-semibold">
            A 42
          </p>
        </div>
        <div className="absolute cursor-pointer right-[45%] top-[77%]">
          <ManagerManageRoomUserIcon
            selectSeat={selectSeat}
            bedNo={"a43"}
            room={room}
          />

          <p className="text-dashboard text-center text-sm font-semibold">
            A 43
          </p>
        </div>
      </>
    );
  } else if (name == "a5") {
    return (
      <>
        <div className="absolute cursor-pointer top-[10%] left-[10%]">
          <ManagerManageRoomUserIcon
            selectSeat={selectSeat}
            bedNo={"a51"}
            room={room}
          />

          <p className="text-dashboard text-center text-sm font-semibold">
            A 51
          </p>
        </div>
      </>
    );
  } else if (name == "b1") {
    return (
      <>
        <div className="absolute cursor-pointer top-[30%] left-[2%]">
          <ManagerManageRoomUserIcon
            selectSeat={selectSeat}
            bedNo={"b11"}
            room={room}
          />

          <p className="text-dashboard text-center text-sm font-semibold">
            B 11
          </p>
        </div>
        <div className="absolute cursor-pointer top-[2%] right-[22%]">
          <ManagerManageRoomUserIcon
            selectSeat={selectSeat}
            bedNo={"b12"}
            room={room}
          />

          <p className="text-dashboard text-center text-sm font-semibold">
            B 12
          </p>
        </div>
        <div className="absolute cursor-pointer top-[70%] left-[50%]">
          <ManagerManageRoomUserIcon
            selectSeat={selectSeat}
            bedNo={"b13"}
            room={room}
          />

          <p className="text-dashboard text-center text-sm font-semibold">
            B 13
          </p>
        </div>
      </>
    );
  } else if (name == "b2") {
    return (
      <>
        <div className="absolute cursor-pointer top-[20%] left-[5%]">
          <ManagerManageRoomUserIcon
            selectSeat={selectSeat}
            bedNo={"b21"}
            room={room}
          />

          <p className="text-dashboard text-center text-sm font-semibold">
            B 21
          </p>
        </div>
        <div className="absolute cursor-pointer top-[20%] right-[5%]">
          <ManagerManageRoomUserIcon
            selectSeat={selectSeat}
            bedNo={"b22"}
            room={room}
          />

          <p className="text-dashboard text-center text-sm font-semibold">
            B 22
          </p>
        </div>
      </>
    );
  } else if (name == "b3") {
    return (
      <>
        <div className="absolute cursor-pointer top-[20%] left-[5%]">
          <ManagerManageRoomUserIcon
            selectSeat={selectSeat}
            bedNo={"b31"}
            room={room}
          />

          <p className="text-dashboard text-center text-sm font-semibold">
            B 31
          </p>
        </div>
        <div className="absolute cursor-pointer top-[20%] right-[5%]">
          <ManagerManageRoomUserIcon
            selectSeat={selectSeat}
            bedNo={"b32"}
            room={room}
          />

          <p className="text-dashboard text-center text-sm font-semibold">
            B 32
          </p>
        </div>
      </>
    );
  }
};

export default ManagerManageRoomRoomSketch;
