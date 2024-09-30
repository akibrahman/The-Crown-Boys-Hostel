import { LuBedSingle } from "react-icons/lu";

const RoomSketch = ({ name, selectSeat, selectedSeat, room }) => {
  if (name == "a3") {
    return (
      <>
        <div className="absolute cursor-pointer top-[30%] left-[26%]">
          <LuBedSingle
            onClick={() => {
              selectSeat("a31");
            }}
            className={`text-5xl duration-300 transition-all shadow-green-600 ${
              selectedSeat.find((seat) => seat.bedNo == "a31")
                ? "shadow-inner"
                : "shadow-inner-none"
            } ${
              room.beds.find((bed) => bed?.bedNo == "a31")?.isBooked
                ? "text-orange-600"
                : "text-green-600"
            }`}
          />
          <p className="text-primary text-center text-sm">A 31</p>
          {selectedSeat.find((seat) => seat.bedNo == "a31") && (
            <p className="text-green-500 text-center text-sm">Selected</p>
          )}
        </div>
        <div className="absolute cursor-pointer top-[30%] right-[4%]">
          <LuBedSingle
            onClick={() => {
              selectSeat("a32");
            }}
            className={`text-5xl duration-300 transition-all shadow-green-600 ${
              selectedSeat.find((seat) => seat.bedNo == "a32")
                ? "shadow-inner"
                : "shadow-inner-none"
            } ${
              room.beds.find((bed) => bed?.bedNo == "a32")?.isBooked
                ? "text-orange-600"
                : "text-green-600"
            }`}
          />
          <p className="text-primary text-center text-sm">A 32</p>
          {selectedSeat.find((seat) => seat.bedNo == "a32") && (
            <p className="text-green-500 text-center text-sm">Selected</p>
          )}
        </div>
        <div className="absolute cursor-pointer bottom-[2%] right-[20%] rotate-90">
          <LuBedSingle
            onClick={() => {
              selectSeat("a33");
            }}
            className={`text-5xl duration-300 transition-all shadow-green-600 ${
              selectedSeat.find((seat) => seat.bedNo == "a33")
                ? "shadow-inner"
                : "shadow-inner-none"
            } ${
              room.beds.find((bed) => bed?.bedNo == "a33")?.isBooked
                ? "text-orange-600"
                : "text-green-600"
            }`}
          />
          <p className="text-primary text-center text-sm">A 33</p>
          {selectedSeat.find((seat) => seat.bedNo == "a33") && (
            <p className="text-green-500 text-center text-sm">Selected</p>
          )}
        </div>
      </>
    );
  } else if (name == "a1") {
    return (
      <>
        <div className="absolute cursor-pointer top-[25%] right-[5%]">
          <LuBedSingle
            onClick={() => {
              selectSeat("a11");
            }}
            className={`text-5xl duration-300 transition-all shadow-green-600 ${
              selectedSeat.find((seat) => seat.bedNo == "a11")
                ? "shadow-inner"
                : "shadow-inner-none"
            } ${
              room.beds.find((bed) => bed?.bedNo == "a11")?.isBooked
                ? "text-orange-600"
                : "text-green-600"
            }`}
          />
          <p className="text-primary text-center text-sm">A 11</p>
          {selectedSeat.find((seat) => seat.bedNo == "a11") && (
            <p className="text-green-500 text-center text-sm">Selected</p>
          )}
        </div>
        <div className="absolute cursor-pointer left-[33%] bottom-[5%]">
          <LuBedSingle
            onClick={() => {
              selectSeat("a12");
            }}
            className={`text-5xl duration-300 transition-all shadow-green-600 ${
              selectedSeat.find((seat) => seat.bedNo == "a12")
                ? "shadow-inner"
                : "shadow-inner-none"
            } ${
              room.beds.find((bed) => bed?.bedNo == "a12")?.isBooked
                ? "text-orange-600"
                : "text-green-600"
            }`}
          />
          <p className="text-primary text-center text-sm">A 12</p>
          {selectedSeat.find((seat) => seat.bedNo == "a12") && (
            <p className="text-green-500 text-center text-sm">Selected</p>
          )}
        </div>
      </>
    );
  } else if (name == "a2") {
    return (
      <>
        <div className="absolute cursor-pointer top-[10%] left-[23%]">
          <LuBedSingle
            onClick={() => {
              selectSeat("a21");
            }}
            className={`text-5xl duration-300 transition-all shadow-green-600 ${
              selectedSeat.find((seat) => seat.bedNo == "a21")
                ? "shadow-inner"
                : "shadow-inner-none"
            } ${
              room.beds.find((bed) => bed?.bedNo == "a21")?.isBooked
                ? "text-orange-600"
                : "text-green-600"
            }`}
          />
          <p className="text-primary text-center text-sm">A 21</p>
          {selectedSeat.find((seat) => seat.bedNo == "a21") && (
            <p className="text-green-500 text-center text-sm">Selected</p>
          )}
        </div>
        <div className="absolute cursor-pointer right-[25%] top-[2%]">
          <LuBedSingle
            onClick={() => {
              selectSeat("a22");
            }}
            className={`text-5xl duration-300 transition-all shadow-green-600 ${
              selectedSeat.find((seat) => seat.bedNo == "a22")
                ? "shadow-inner"
                : "shadow-inner-none"
            } ${
              room.beds.find((bed) => bed?.bedNo == "a22")?.isBooked
                ? "text-orange-600"
                : "text-green-600"
            }`}
          />
          <p className="text-primary text-center text-sm">A 22</p>
          {selectedSeat.find((seat) => seat.bedNo == "a22") && (
            <p className="text-green-500 text-center text-sm">Selected</p>
          )}
        </div>
        <div className="absolute cursor-pointer right-[25%] top-[60%]">
          <LuBedSingle
            onClick={() => {
              selectSeat("a23");
            }}
            className={`text-5xl duration-300 transition-all shadow-green-600 ${
              selectedSeat.find((seat) => seat.bedNo == "a23")
                ? "shadow-inner"
                : "shadow-inner-none"
            } ${
              room.beds.find((bed) => bed?.bedNo == "a23")?.isBooked
                ? "text-orange-600"
                : "text-green-600"
            }`}
          />
          <p className="text-primary text-center text-sm">A 23</p>
          {selectedSeat.find((seat) => seat.bedNo == "a23") && (
            <p className="text-green-500 text-center text-sm">Selected</p>
          )}
        </div>
        <div className="absolute cursor-pointer left-[23%] top-[70%]">
          <LuBedSingle
            onClick={() => {
              selectSeat("a24");
            }}
            className={`text-5xl duration-300 transition-all shadow-green-600 ${
              selectedSeat.find((seat) => seat.bedNo == "a24")
                ? "shadow-inner"
                : "shadow-inner-none"
            } ${
              room.beds.find((bed) => bed?.bedNo == "a24")?.isBooked
                ? "text-orange-600"
                : "text-green-600"
            }`}
          />
          <p className="text-primary text-center text-sm">A 24</p>
          {selectedSeat.find((seat) => seat.bedNo == "a24") && (
            <p className="text-green-500 text-center text-sm">Selected</p>
          )}
        </div>
      </>
    );
  } else if (name == "a4") {
    return (
      <>
        <div className="absolute cursor-pointer top-[40%] left-[5%]">
          <LuBedSingle
            onClick={() => {
              selectSeat("a41");
            }}
            className={`text-5xl duration-300 transition-all shadow-green-600 ${
              selectedSeat.find((seat) => seat.bedNo == "a41")
                ? "shadow-inner"
                : "shadow-inner-none"
            } ${
              room.beds.find((bed) => bed?.bedNo == "a41")?.isBooked
                ? "text-orange-600"
                : "text-green-600"
            }`}
          />
          <p className="text-primary text-center text-sm">A 41</p>
          {selectedSeat.find((seat) => seat.bedNo == "a41") && (
            <p className="text-green-500 text-center text-sm">Selected</p>
          )}
        </div>
        <div className="absolute cursor-pointer right-[5%] top-[40%]">
          <LuBedSingle
            onClick={() => {
              selectSeat("a42");
            }}
            className={`text-5xl duration-300 transition-all shadow-green-600 ${
              selectedSeat.find((seat) => seat.bedNo == "a42")
                ? "shadow-inner"
                : "shadow-inner-none"
            } ${
              room.beds.find((bed) => bed?.bedNo == "a42")?.isBooked
                ? "text-orange-600"
                : "text-green-600"
            }`}
          />
          <p className="text-primary text-center text-sm">A 42</p>
          {selectedSeat.find((seat) => seat.bedNo == "a42") && (
            <p className="text-green-500 text-center text-sm">Selected</p>
          )}
        </div>
      </>
    );
  } else if (name == "a5") {
    return (
      <>
        <div className="absolute cursor-pointer top-[10%] left-[10%]">
          <LuBedSingle
            onClick={() => {
              selectSeat("a51");
            }}
            className={`text-5xl duration-300 transition-all shadow-green-600 ${
              selectedSeat.find((seat) => seat.bedNo == "a51")
                ? "shadow-inner"
                : "shadow-inner-none"
            } ${
              room.beds.find((bed) => bed?.bedNo == "a51")?.isBooked
                ? "text-orange-600"
                : "text-green-600"
            }`}
          />
          <p className="text-primary text-center text-sm">A 51</p>
          {selectedSeat.find((seat) => seat.bedNo == "a51") && (
            <p className="text-green-500 text-center text-sm">Selected</p>
          )}
        </div>
      </>
    );
  } else if (name == "b1") {
    return (
      <>
        <div className="absolute cursor-pointer top-[30%] left-[2%]">
          <LuBedSingle
            onClick={() => {
              selectSeat("b11");
            }}
            className={`text-5xl duration-300 transition-all shadow-green-600 ${
              selectedSeat.find((seat) => seat.bedNo == "b11")
                ? "shadow-inner"
                : "shadow-inner-none"
            } ${
              room.beds.find((bed) => bed?.bedNo == "b11")?.isBooked
                ? "text-orange-600"
                : "text-green-600"
            }`}
          />
          <p className="text-primary text-center text-sm">B 11</p>
          {selectedSeat.find((seat) => seat.bedNo == "b11") && (
            <p className="text-green-500 text-center text-sm">Selected</p>
          )}
        </div>
        <div className="absolute cursor-pointer top-[2%] right-[22%]">
          <LuBedSingle
            onClick={() => {
              selectSeat("b12");
            }}
            className={`text-5xl duration-300 transition-all shadow-green-600 ${
              selectedSeat.find((seat) => seat.bedNo == "b12")
                ? "shadow-inner"
                : "shadow-inner-none"
            } ${
              room.beds.find((bed) => bed?.bedNo == "b12")?.isBooked
                ? "text-orange-600"
                : "text-green-600"
            }`}
          />
          <p className="text-primary text-center text-sm">B 12</p>
          {selectedSeat.find((seat) => seat.bedNo == "b12") && (
            <p className="text-green-500 text-center text-sm">Selected</p>
          )}
        </div>
        <div className="absolute cursor-pointer top-[70%] left-[50%]">
          <LuBedSingle
            onClick={() => {
              selectSeat("b13");
            }}
            className={`text-5xl duration-300 transition-all shadow-green-600 ${
              selectedSeat.find((seat) => seat.bedNo == "b13")
                ? "shadow-inner"
                : "shadow-inner-none"
            } ${
              room.beds.find((bed) => bed?.bedNo == "b13")?.isBooked
                ? "text-orange-600"
                : "text-green-600"
            }`}
          />
          <p className="text-primary text-center text-sm">B 13</p>
          {selectedSeat.find((seat) => seat.bedNo == "b13") && (
            <p className="text-green-500 text-center text-sm">Selected</p>
          )}
        </div>
      </>
    );
  } else if (name == "b2") {
    return (
      <>
        <div className="absolute cursor-pointer top-[20%] left-[5%]">
          <LuBedSingle
            onClick={() => {
              selectSeat("b21");
            }}
            className={`text-5xl duration-300 transition-all shadow-green-600 ${
              selectedSeat.find((seat) => seat.bedNo == "b21")
                ? "shadow-inner"
                : "shadow-inner-none"
            } ${
              room.beds.find((bed) => bed?.bedNo == "b21")?.isBooked
                ? "text-orange-600"
                : "text-green-600"
            }`}
          />
          <p className="text-primary text-center text-sm">B 21</p>
          {selectedSeat.find((seat) => seat.bedNo == "b21") && (
            <p className="text-green-500 text-center text-sm">Selected</p>
          )}
        </div>
        <div className="absolute cursor-pointer top-[20%] right-[5%]">
          <LuBedSingle
            onClick={() => {
              selectSeat("b22");
            }}
            className={`text-5xl duration-300 transition-all shadow-green-600 ${
              selectedSeat.find((seat) => seat.bedNo == "b22")
                ? "shadow-inner"
                : "shadow-inner-none"
            } ${
              room.beds.find((bed) => bed?.bedNo == "b22")?.isBooked
                ? "text-orange-600"
                : "text-green-600"
            }`}
          />
          <p className="text-primary text-center text-sm">B 22</p>
          {selectedSeat.find((seat) => seat.bedNo == "b22") && (
            <p className="text-green-500 text-center text-sm">Selected</p>
          )}
        </div>
      </>
    );
  } else if (name == "b3") {
    return (
      <>
        <div className="absolute cursor-pointer top-[20%] left-[5%]">
          <LuBedSingle
            onClick={() => {
              selectSeat("b31");
            }}
            className={`text-5xl duration-300 transition-all shadow-green-600 ${
              selectedSeat.find((seat) => seat.bedNo == "b31")
                ? "shadow-inner"
                : "shadow-inner-none"
            } ${
              room.beds.find((bed) => bed?.bedNo == "b31")?.isBooked
                ? "text-orange-600"
                : "text-green-600"
            }`}
          />
          <p className="text-primary text-center text-sm">B 31</p>
          {selectedSeat.find((seat) => seat.bedNo == "b31") && (
            <p className="text-green-500 text-center text-sm">Selected</p>
          )}
        </div>
        <div className="absolute cursor-pointer top-[20%] right-[5%]">
          <LuBedSingle
            onClick={() => {
              selectSeat("b32");
            }}
            className={`text-5xl duration-300 transition-all shadow-green-600 ${
              selectedSeat.find((seat) => seat.bedNo == "b32")
                ? "shadow-inner"
                : "shadow-inner-none"
            } ${
              room.beds.find((bed) => bed?.bedNo == "b32")?.isBooked
                ? "text-orange-600"
                : "text-green-600"
            }`}
          />
          <p className="text-primary text-center text-sm">B 32</p>
          {selectedSeat.find((seat) => seat.bedNo == "b32") && (
            <p className="text-green-500 text-center text-sm">Selected</p>
          )}
        </div>
      </>
    );
  }
};

export default RoomSketch;
