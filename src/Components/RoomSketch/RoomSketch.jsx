import { LuBedSingle } from "react-icons/lu";

const RoomSketch = ({ name, selectSeat, selectedSeat, room }) => {
  return (
    <div className="flex items-center justify-center gap-4 flex-wrap h-full w-full absolute top-0 left-0 z-10">
      {room.beds.map((bed, i) => (
        <div
          key={i}
          style={{ left: bed.left, top: bed.top }}
          className="absolute cursor-pointer"
        >
          <LuBedSingle
            onClick={() => {
              selectSeat(bed.bedNo);
            }}
            className={`text-[42px] duration-300 transition-all shadow-green-600 ${
              selectedSeat.find((seat) => seat.bedNo == bed.bedNo)
                ? "shadow-inner"
                : "shadow-inner-none"
            } ${
              room.beds.find((bed) => bed?.bedNo == bed.bedNo)?.isBooked
                ? "text-orange-600"
                : "text-green-600"
            }`}
          />
          <p className="text-primary text-center text-sm">
            {`${bed.bedNo[0].toUpperCase()} ${bed.bedNo.slice(1)}`}
          </p>
          {selectedSeat.find((seat) => seat.bedNo == bed.bedNo) && (
            <p className="text-green-500 text-center text-sm">Selected</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default RoomSketch;
