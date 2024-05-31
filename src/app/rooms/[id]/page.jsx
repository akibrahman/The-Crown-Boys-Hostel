"use client";

import RoomSketch from "@/Components/RoomSketch/RoomSketch";
import { convertCamelCaseToCapitalized } from "@/utils/camelToCapitalize";
import { allRooms } from "@/utils/rooms";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaArrowLeft, FaTimes } from "react-icons/fa";

const Page = ({ params }) => {
  const { id } = params;
  const route = useRouter();
  const emVideo = `<iframe width="560" height="315" src="https://www.youtube.com/embed/dRAU3EdsXcE?si=YJ6_GifJ8lc0Nv_e" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;

  const room = allRooms.find((singleRoom) => singleRoom._id == id);
  console.log(room);

  const [selectedSeat, setSelectedSeat] = useState([]);
  const targetDivRef = useRef();

  const scrollToTable = () => {
    if (targetDivRef.current) {
      targetDivRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  const selectSeat = async (bedNo) => {
    if (room.beds.find((bed) => bed?.bedNo == bedNo).isBooked) {
      toast.error("Bed is already booked!");
    } else if (selectedSeat.find((seat) => seat.bedNo == bedNo)) {
      setSelectedSeat([...selectedSeat.filter((seat) => seat.bedNo != bedNo)]);
      toast.success(`${bedNo} Bed selection removed`);
    } else {
      scrollToTable();
      setSelectedSeat([...selectedSeat, { bedNo, singleRoom: room }]);
      toast.success(`${bedNo} Bed selected`);
    }
  };

  return (
    <div className="min-h-screen pt-5 md:pt-10 pb-20 md:pb-32 dark:bg-gradient-to-r dark:from-primary dark:to-secondary bg-gradient-to-r from-primary to-secondary dark:text-stone-300 text-stone-300 relative">
      <FaArrowLeft
        onClick={() => route.back()}
        className="absolute top-5 md:top-10 left-5 md:left-10 text-4xl bg-blue-500 p-2 rounded-full duration-300 transition-all active:scale-90 cursor-pointer"
      />
      <p className="text-center text-lg md:text-xl underline font-medium">
        Room Details:{" "}
        {room.name.split("")[0].toUpperCase() + "-" + room.name.split("")[1]}{" "}
        <span className="ml-4">
          {" "}
          {room.floor}
          <sup>
            {room.floor == 1 ? "st" : room.floor == 3 ? "rd" : "th"}
          </sup>{" "}
          Floor
        </span>
      </p>
      {/*//! Main Div  */}
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 gap-4 p-10">
        {/*//! Video Div  */}
        <div className="flex flex-col items-center gap-4">
          <p>Room Video</p>
          <iframe
            width="400"
            height="550"
            src={room.video}
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
        </div>
        {/*//! Sketch Div  */}
        <div className="flex flex-col items-center gap-4 relative">
          <p>Room Sketch</p>
          <div className="w-full relative select-none">
            <Image
              height={100}
              width={450}
              alt="Sketch"
              src={room.sketch}
              className="w-full"
            />
            <RoomSketch
              name={room.name}
              room={room}
              selectSeat={selectSeat}
              selectedSeat={selectedSeat}
            />
          </div>
          <div className="flex items-center gap-7">
            <div className="flex items-center gap-3">
              <span className="w-4 h-4 rounded-sm bg-orange-600"></span> Booked
              <span className="w-4 h-4 rounded-sm bg-green-600"></span>{" "}
              Available
            </div>
          </div>
          <p className="font-semibold text-blue-500 text-center">
            **সিট সিলেক্ট এবং বুক করতে আপনার পছন্দের বেডে ক্লিক করুন**
          </p>
        </div>
        {/*//! Images Div  */}
        <div className="lg:row-span-2 flex flex-col items-center gap-4">
          <p>Room Image</p>
          <Image
            height={100}
            width={400}
            alt="Sketch"
            src={room.image}
            className="rounded-md"
          />
          <p>Beds Images</p>
          <div className="grid grid-cols-2 gap-4">
            {room.beds.map((bed, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <Image
                  height={100}
                  width={200}
                  alt="Sketch"
                  src={bed.image}
                  className="w[65%] rounded-md"
                />
                <div className="">
                  <p>No.: {bed.bedNo.toUpperCase()}</p>
                  <p>Rent: {bed.rent.displayRent} BDT</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/*//! Table Div  */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-3 place-items-center gap-4 mb-6">
            {/* Details  */}
            <div className="">
              <p className="text-lg font-bold text-center mb-5 underline">
                Details
              </p>
              <div className="mb-5 space-y-1">
                <p className="text-blue-500 font-medium">
                  <span className="w-[70px] inline-block">Name:</span>
                  <span className="text-white font-normal ml-5">
                    {convertCamelCaseToCapitalized(room.name)}
                  </span>
                </p>
                <p className="text-blue-500 font-medium">
                  <span className="w-[70px] inline-block">Block:</span>
                  <span className="text-white font-normal ml-5">
                    {convertCamelCaseToCapitalized(room.block)}
                  </span>
                </p>
                <p className="text-blue-500 font-medium">
                  <span className="w-[70px] inline-block">floor:</span>
                  <span className="text-white font-normal ml-5">
                    {room.floor}
                    <sup>
                      {room.floor == 1 ? "st" : room.floor == 3 ? "rd" : "th"}
                    </sup>{" "}
                    Floor
                  </span>
                </p>
                <p className="text-blue-500 font-medium">
                  <span className="w-[70px] inline-block">Type:</span>
                  <span className="text-white font-normal ml-5">
                    {room.type}
                  </span>
                </p>
                <p className="text-blue-500 font-medium">
                  <span className="w-[70px] inline-block">Seat(s):</span>
                  <span className="text-white font-normal ml-5">
                    {room.seats}
                  </span>
                </p>
              </div>
            </div>
            {/* Toilet  */}
            <div className="">
              <p className="text-lg font-bold text-center mb-5 underline">
                Toilet
              </p>
              <Image
                width={180}
                height={100}
                alt="Picture of Toilet"
                src={room.toilet.image}
                className="rounded-md"
              />
              <p className="text-center mt-2">
                {convertCamelCaseToCapitalized(room.toilet.type)}
              </p>
            </div>
            {/* Balcony  */}
            <div className="">
              <p className="text-lg font-bold text-center mb-5 underline">
                Balcony
              </p>
              {room.balcony.state && (
                <Image
                  width={180}
                  height={100}
                  alt="Picture of Toilet"
                  src={room.balcony.state ? room.balcony.image : ""}
                  className="rounded-md"
                />
              )}
              <p className="text-center mt-2">
                {room.balcony.state ? "Available" : "Not Available"}
              </p>
            </div>
          </div>
          <div className="overflow-x-scroll w-full">
            <p className="text-lg font-bold text-center mb-5">Selected Seats</p>
            <table ref={targetDivRef} className="md:w-full mx-auto">
              <thead>
                <tr>
                  <td className="border px-5 py-2 text-center">SL.</td>
                  <td className="border px-5 py-2 text-center">Bed Image</td>
                  <td className="border px-5 py-2 text-center">Bed No.</td>
                  <td className="border px-5 py-2 text-center">Floor</td>
                  <td className="border px-5 py-2 text-center">Room Name</td>
                  <td className="border px-5 py-2 text-center">Rent (BDT)</td>
                  <td className="border px-5 py-2 text-center">
                    Booking Charge (BDT)
                  </td>
                  <td className="border px-5 py-2 text-center">Action</td>
                </tr>
              </thead>
              {selectedSeat.map((seat, i) => (
                // <div  className="flex items-center gap-3">
                //   <p>{i + 1}</p>
                //   <p>{seat.bedNo.toUpperCase()}</p>
                // </div>
                <tbody key={i}>
                  <td className="border px-5 py-2 text-center">{i + 1}</td>
                  <td className="border px-5 py-2 text-center flex justify-center">
                    <Image
                      width={100}
                      height={100}
                      alt="Picture of bed"
                      src={
                        seat.singleRoom.beds.find(
                          (bedd) => bedd.bedNo == seat.bedNo
                        ).image
                      }
                      className="rounded-md"
                    />
                  </td>
                  <td className="border px-5 py-2 text-center">
                    {seat.bedNo.toUpperCase()}
                  </td>
                  <td className="border px-5 py-2 text-center">
                    {seat.singleRoom.floor}
                    <sup>
                      {seat.singleRoom.floor == 1
                        ? "st"
                        : seat.singleRoom.floor == 3
                        ? "rd"
                        : "th"}
                    </sup>
                  </td>
                  <td className="border px-5 py-2 text-center">
                    {seat.singleRoom.name.toUpperCase()}
                  </td>
                  <td className="border px-5 py-2 text-center">
                    {
                      seat.singleRoom.beds.find(
                        (bedd) => bedd.bedNo == seat.bedNo
                      ).rent.displayRent
                    }{" "}
                    /-
                  </td>
                  <td className="border px-5 py-2 text-center">
                    {
                      seat.singleRoom.beds.find(
                        (bedd) => bedd.bedNo == seat.bedNo
                      ).bookingCharge
                    }{" "}
                    /-
                  </td>
                  <td className="border">
                    <FaTimes
                      onClick={() => selectSeat(seat.bedNo)}
                      className="block mx-auto text-xl text-red-500 cursor-pointer"
                    />
                  </td>
                </tbody>
              ))}
            </table>
            {selectedSeat.length == 0 && (
              <p className="text-center mt-5">No selected seta(s)</p>
            )}
          </div>
          {selectedSeat.length != 0 && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <p className="md:font-medium underline">
                বুকিং কনফার্ম করতে পাশের বাটনে ক্লিক করে বুকিং চার্জ -{" "}
                {selectedSeat.reduce(
                  (a, c) =>
                    a +
                    c.singleRoom.beds.find((bed) => bed.bedNo == c.bedNo)
                      .bookingCharge,
                  0
                )}{" "}
                টাকা পরিশোধ করুনঃ
              </p>
              {/* <Link href={"/rooms"}> */}
              <button className="duration-300 px-3 py-1 bg-green-600 text-white font-medium active:scale-90 cursor-pointer select-none inline-block w-max">
                Pay Booking Charge
              </button>
              {/* </Link> */}
            </div>
          )}
        </div>
      </div>
      {/* <div dangerouslySetInnerHTML={{ __html: emVideo }} /> */}
    </div>
  );
};

export default Page;
