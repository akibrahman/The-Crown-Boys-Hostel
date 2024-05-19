import { LuBedSingle } from "react-icons/lu";

const RoomSketch = ({ name, selectSeat, selectedSeat, room }) => {
  if (name == "a3") {
    return (
      <>
        <LuBedSingle
          onClick={() => {
            selectSeat("a31");
          }}
          className={`absolute cursor-pointer top-[30%] left-[26%] text-7xl duration-300 transition-all shadow-green-600 ${
            selectedSeat.find((seat) => seat.bedNo == "a31")
              ? "shadow-inner"
              : "shadow-inner-none"
          } ${
            room.beds.find((bed) => bed?.bedNo == "a31")?.isBooked
              ? "text-orange-600"
              : "text-green-600"
          }`}
        />
        <LuBedSingle
          onClick={() => {
            selectSeat("a32");
          }}
          className={`absolute cursor-pointer top-[40%] right-[2%] text-7xl duration-300 transition-all shadow-green-600 ${
            selectedSeat.find((seat) => seat.bedNo == "a32")
              ? "shadow-inner"
              : "shadow-inner-none"
          } ${
            room.beds.find((bed) => bed?.bedNo == "a32")?.isBooked
              ? "text-orange-600"
              : "text-green-600"
          }`}
        />
        <LuBedSingle
          onClick={() => {
            selectSeat("a33");
          }}
          className={`absolute cursor-pointer bottom-3 rotate-90 right-24 text-7xl duration-300 transition-all shadow-green-600 ${
            selectedSeat.find((seat) => seat.bedNo == "a33")
              ? "shadow-inner"
              : "shadow-inner-none"
          } ${
            room.beds.find((bed) => bed?.bedNo == "a33")?.isBooked
              ? "text-orange-600"
              : "text-green-600"
          }`}
        />
      </>
    );
  }
};

export default RoomSketch;
