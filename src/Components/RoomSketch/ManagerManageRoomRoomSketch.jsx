import axios from "axios";
import Image from "next/image";
import toast from "react-hot-toast";
import ManagerManageRoomUserIcon from "../Dashboard/ManagerManageRoomUserIcon";

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
        `/api/room?name=${room.name}&floor=${room.floor}`
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

  return (
    <div className="flex items-center justify-center gap-4 flex-wrap h-full w-full absolute top-0 left-0 z-10">
      {room.beds.map((bed, i) => (
        <div
          key={i}
          style={{ left: bed.left, top: bed.top }}
          className="absolute cursor-pointer"
        >
          <ManagerManageRoomUserIcon
            selectSeat={selectSeat}
            bedNo={bed.bedNo}
            room={room}
          />

          <p className="text-dashboard text-center text-sm font-semibold">
            {`${bed.bedNo[0].toUpperCase()} ${bed.bedNo.slice(1)}`}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ManagerManageRoomRoomSketch;
