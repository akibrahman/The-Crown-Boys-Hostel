"use client";

import { allRooms } from "@/utils/rooms";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FaArrowRight } from "react-icons/fa";

const Rooms = () => {
  const searchParams = useSearchParams();
  const floor = searchParams.get("floor");

  return (
    <div className="min-h-screen pb-20 dark:bg-gradient-to-r dark:from-primary dark:to-secondary bg-gradient-to-r from-primary to-secondary dark:text-stone-300 text-stone-300 relative">
      {floor &&
      (floor == "1" ||
        floor == "3" ||
        floor == "4" ||
        floor == "6" ||
        floor == "7") ? (
        <div>
          <TargetedRooms
            rooms={allRooms.filter((room) => room.floor == floor)}
            totalRooms={allRooms
              .filter((room) => room.floor == floor)
              .reduce(
                (accumulator, currentValue) => accumulator + currentValue.seats,
                0
              )}
            availableRooms={allRooms
              .filter((room) => room.floor == floor)
              .reduce(
                (accumulator, currentValue) =>
                  accumulator +
                  currentValue.beds.reduce(
                    (accumulator2, currentValue2) =>
                      accumulator2 + currentValue2.isBooked == true ? 0 : 1,
                    0
                  ),
                0
              )}
            floor={floor}
          />
        </div>
      ) : (
        <div>
          <Floors allRooms={allRooms} />
          <div className="lg:absolute mt-10 lg:mt-0 top-0 left-0 lg:w-[400px] h-[100%] flex items-center justify-center flex-col">
            <p className="w-[200px] flex items-center gap-2">
              Total Rooms:
              <span className="text-blue-500 text-3xl font-medium">
                {allRooms.length}
              </span>
            </p>
            <p className="w-[200px] flex items-center gap-2">
              Total Seats:
              <span className="text-blue-500 text-3xl font-medium">
                {allRooms.reduce(
                  (accumulator, currentValue) =>
                    accumulator + currentValue.seats,
                  0
                )}
              </span>
            </p>
            <p className="w-[200px]  flex items-center gap-2">
              Available Seats:
              <span className="text-blue-500 text-3xl font-medium">
                {allRooms.reduce(
                  (accumulator, currentValue) =>
                    accumulator +
                    currentValue.beds.reduce(
                      (accumulator2, currentValue2) =>
                        currentValue2.isBooked == false
                          ? accumulator2 + 1
                          : accumulator2,
                      0
                    ),
                  0
                )}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;

const Floors = ({ allRooms }) => {
  const floors = [3, 4, 6, 7]; // 2  4  5  7  8
  return (
    <div className="max-w-[420px] w-[90%] mx-auto text-center pt-20">
      <p className="text-lg">Select Floor</p>
      <div className="flex flex-col gap-5 mt-8">
        {floors.map((floor) => (
          <Link
            key={floor}
            href={`/rooms?floor=${floor}`}
            className="text-lg md:text-base shadow shadow-sky-300 py-2 md:py-3 cursor-pointer duration-100 ease-linear select-none flex items-center justify-center gap-12 hover:shadow-blue-700 hover:shadow-md hover:scale-105 active:scale-95"
          >
            <span className="text-xs md:text-sm text-blue-600">
              Total Seat:{" "}
              {allRooms
                .filter((room) => room.floor == floor)
                .reduce(
                  (accumulator, currentValue) =>
                    accumulator + currentValue.seats,
                  0
                )}
            </span>
            <span>
              {" "}
              {floor}
              <sup>{floor == 1 ? "st" : floor == 3 ? "rd" : "th"}</sup> Floor
            </span>
            <span className="text-xs md:text-sm text-green-600">
              Available seat:{" "}
              {allRooms
                .filter((room) => room.floor == floor)
                .reduce(
                  (a, c) =>
                    a +
                    c.beds.reduce(
                      (a2, c2) => (c2.isBooked == false ? a2 + 1 : a2),
                      0
                    ),
                  0
                )}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

const TargetedRooms = ({ floor, totalRooms, availableRooms, rooms }) => {
  return (
    <div>
      <div className="flex items-center justify-center gap-4 py-3 md:py-6 px-8 md:px-20">
        <div className="flex flex-col md:flex-row items-center justify-center text-lg flex-grow text-center gap-1 md:gap-6 pb-6">
          <span className="block">Total Seats: {totalRooms}</span>
          <span className="underline font-semibold block">
            Rooms of {floor}
            <sup>{floor == 1 ? "st" : floor == 3 ? "rd" : "th"}</sup> Floor
          </span>
          <span className="text-green-500 block">
            Available Seats: {availableRooms}
          </span>
        </div>
        <Link
          href="/rooms"
          className="shadow shadow-red-50 px-2 py-1 text-sm cursor-pointer duration-200 ease-linear select-none hover:scale-110 active:scale-95"
        >
          Change Floor
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-y-20 gap-y-16 md:gap-x-10 px-5 lg:px-20">
        {rooms
          .sort((roomA, roomB) => {
            const hasFalseA = roomA.beds.some((bed) => bed.isBooked === false);
            const hasFalseB = roomB.beds.some((bed) => bed.isBooked === false);

            if (hasFalseA && !hasFalseB) {
              return -1; // roomA comes before roomB
            } else if (!hasFalseA && hasFalseB) {
              return 1; // roomB comes before roomA
            } else {
              return 0; // maintain the same order
            }
          })
          .map((room, i) => (
            <div
              key={i}
              className="h-[200px] bg-stone-800 rounded-s-full flex gap-3 lg:gap-10 items-center relative"
            >
              <Link href={`/rooms/${room._id}`}>
                <button className="absolute bottom-0 lg:bottom-6 right-0 lg:right-6 px-2 md:px-4 py-0.5 md:py-1 bg-blue-500 text-white flex items-center gap-3 duration-300 active:scale-90">
                  Details
                  <FaArrowRight />
                </button>
              </Link>
              {room.beds.find((bed) => bed.isBooked == false) && (
                <p className="absolute top-2 right-3 text-green-600 font-medium">
                  Available
                </p>
              )}
              <div className="h-full w-max flex items-center">
                <Image
                  height={100}
                  width={180}
                  src={room.image}
                  alt={`Image of  room number ${room.name} of 'The Crown Boys Hostel'`}
                  className="block ounded-e-full rounded-xl"
                />
              </div>
              <div className="border-l-4 border-blue-500 pl-2 md:pl-4 py-3">
                <p className="text-blue-500 font-medium text-lg">
                  Room Name:{" "}
                  <span>
                    {room.name.split("")[0].toUpperCase() +
                      " " +
                      room.name.split("")[1]}
                  </span>
                </p>
                <p>
                  Seats:{" "}
                  <span className="text-blue-500 font-medium">
                    {room.seats}
                  </span>
                </p>
                <p>
                  Type:{" "}
                  <span className="text-blue-500 font-medium capitalize">
                    {room.type}
                  </span>
                </p>
                <p>
                  Block:{" "}
                  <span className="text-blue-500 font-medium">
                    {room.block.toUpperCase()}
                  </span>
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
