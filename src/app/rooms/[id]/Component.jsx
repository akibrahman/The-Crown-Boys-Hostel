"use client";

import { motion } from "framer-motion";
import RoomSketch from "@/Components/RoomSketch/RoomSketch";
import { convertCamelCaseToCapitalized } from "@/utils/camelToCapitalize";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { FaArrowLeft, FaTimes } from "react-icons/fa";

const Component = ({ id }) => {
  const route = useRouter();

  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const amount = searchParams.get("amount");
  const paymentID = searchParams.get("paymentID");
  const transactionId = searchParams.get("transactionId");
  const bkashTransactionId = searchParams.get("trxId");
  const bkashMessage = searchParams.get("message");

  const clearUrl = () => {
    const url = new URL(window.location.href);
    const baseUrl = url.origin + url.pathname;
    return route.replace(baseUrl);
  };

  const { data: room, refetch } = useQuery({
    queryKey: ["Room", "All", id],
    queryFn: async ({ queryKey }) => {
      const { data } = await axios.get(`/api/room?id=${queryKey[2]}`);
      if (data.success) {
        return data.rooms[0];
      } else {
        return null;
      }
    },
  });

  const [selectedSeat, setSelectedSeat] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
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

  const userFormSubmit = async (e) => {
    e.preventDefault();
    setIsBooking(true);
    const name = e.target.name.value;
    const phoneNumber = e.target.phoneNumber.value;
    const email = e.target.email.value;
    const beds = selectedSeat.map((seat) => {
      return { bedNo: seat.bedNo, roomId: seat.singleRoom._id };
    });
    const bookingTime = new Date().toISOString();
    const bookingData = { name, phoneNumber, email, beds, bookingTime };
    try {
      console.log("Calling API");
      const { data } = await axios.post("/api/booking", bookingData);
      if (data.success && data.statusCode == "0000") {
        e.target.reset();
        route.replace(data.bkashURL);
        setShowForm(false);
        setSelectedSeat([]);
      } else toast.error(data.msg);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.msg);
    } finally {
      setIsBooking(false);
    }
  };

  if (!room)
    return (
      <div className="min-h-screen pb-20 bg-dashboard text-stone-300 relative flex items-center justify-center gap-2">
        <CgSpinner className="text-xl text-white animate-spin" />
        <p>Loading Room...</p>
      </div>
    );

  return (
    <>
      {" "}
      {/* Success  */}
      {success && paymentID && success == "true" && (
        <div className="fixed z-50 top-0 left-0 w-full h-screen bg-[rgba(0,0,0,0.5)]">
          <motion.div
            initial={{ scale: 0.5, x: "-50%", y: "-50%", opacity: 0 }}
            whileInView={{ scale: 1, x: "-50%", y: "-50%", opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="absolute text-pink-600 top-[45%] md:top-1/2 left-1/2 bg-white md:h-[80%] w-[95%] md:w-[60%] rounded-xl flex flex-col items-center justify-center gap-2 font-medium py-10 md:py-0"
          >
            {" "}
            <Image
              src={"/images/payment-success-tick.png"}
              alt="Payment Successful"
              width={150}
              height={150}
              className="mx-auto"
            />
            <h1 className="text-2xl font-bold text-green-600 mt-4">
              Payment Successful!
            </h1>
            <p className="text-gray-700 md:mt-2 mt-1 px-3 text-center">
              Thank you for your payment. Your transaction has been completed
              successfully.
            </p>
            <p className="text-gray-700 md:mt-2 mt-1">
              Bkash Transaction ID: {bkashTransactionId}
            </p>
            <p className="text-gray-700 md:mt-2 mt-1">
              System Transaction ID: {transactionId}
            </p>
            <p className="text-gray-700 md:mt-2 mt-1">Amount: {amount} BDT</p>
            <button
              onClick={clearUrl}
              className="mt-3 md:mt-6 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300 active:scale-90"
            >
              Got It!
            </button>
          </motion.div>
        </div>
      )}
      {/* Failed  */}
      {success && paymentID && success == "false" && (
        <div className="fixed z-50 top-0 left-0 w-full h-screen bg-[rgba(0,0,0,0.5)]">
          <motion.div
            initial={{ scale: 0.5, x: "-50%", y: "-50%", opacity: 0 }}
            whileInView={{ scale: 1, x: "-50%", y: "-50%", opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="absolute text-pink-600 top-[45%] md:top-1/2 left-1/2 bg-white md:h-[80%] w-[95%] md:w-[60%] rounded-xl flex flex-col items-center justify-center gap-2 font-medium py-10 md:py-0"
          >
            <Image
              src={"/images/payment-failed-tick.png"}
              alt="Payment Successful"
              width={150}
              height={150}
              className="mx-auto"
            />
            <h1 className="text-2xl font-bold text-red-600 mt-4">
              Payment Failed
            </h1>
            <p className="text-gray-700 mt-2">Error Message: {bkashMessage}</p>
            <button
              onClick={clearUrl}
              className="mt-6 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 active:scale-90"
            >
              Try Again
            </button>
          </motion.div>
        </div>
      )}
      <div className="min-h-screen pt-5 md:pt-10 pb-20 md:pb-32 bg-dashboard text-stone-300 relative">
        {/*//! User Form  */}
        <div
          className={`${
            showForm
              ? "opacity-1 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          } fixed top-0 left-0 bg-[rgba(0,0,0,0.5)] z-50 w-full h-screen duration-300 transition-all`}
        >
          <div className="h-[600px] md:h-[400px] w-[390px] md:w-[500px] fixed top-10 md:top-1/2 md:-translate-y-1/2 left-1/2 -translate-x-1/2 bg-secondary rounded-xl duration-300 transition-all">
            <FaTimes
              onClick={() => setShowForm(false)}
              className="absolute top-5 right-5 text-xl cursor-pointer"
            />
            <div className="flex flex-col h-full items-center justify-center">
              <p className="text-xl text-center font-semibold text-white pb-10">
                Information
              </p>
              <form
                onSubmit={userFormSubmit}
                className="flex flex-col items-center space-y-4"
              >
                <input
                  required
                  name="name"
                  type="text"
                  placeholder="You Name ?"
                  className="bg-transparent w-[350px] outline-none focus-visible:shadow-xl shadow-sky-500 text-sky-500 border-sky-500 border rounded-full px-8 py-3"
                />
                <input
                  required
                  name="phoneNumber"
                  type="number"
                  placeholder="You Contact Number ?"
                  className="bg-transparent w-[350px] outline-none focus-visible:shadow-xl shadow-sky-500 text-sky-500 border-sky-500 border rounded-full px-8 py-3"
                />
                <input
                  required
                  name="email"
                  type="email"
                  placeholder="You E-mail ?"
                  className="bg-transparent w-[350px] outline-none focus-visible:shadow-xl shadow-sky-500 text-sky-500 border-sky-500 border rounded-full px-8 py-3"
                />
                <button
                  type="submit"
                  className="bg-sky-500 px-4 py-1 rounded-full active:scale-90 duration-300 font-medium flex items-center gap-4"
                >
                  Confirm Booking{" "}
                  {isBooking && <CgSpinner className="text-xl animate-spin" />}
                </button>
              </form>
            </div>
          </div>
        </div>
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
            <div
              dangerouslySetInnerHTML={{ __html: room.video }}
              className=""
            ></div>
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
                <span className="w-4 h-4 rounded-sm bg-orange-600"></span>{" "}
                Booked
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
                    <p>Rent: {bed.displayRent} BDT</p>
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
                    <span className="w-[70px] inline-block">Building:</span>
                    <span className="text-white font-normal ml-5">
                      {convertCamelCaseToCapitalized(room.building)}
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
                {room.balcony.balconyState && (
                  <Image
                    width={180}
                    height={100}
                    alt="Picture of Toilet"
                    src={room.balcony.balconyState ? room.balcony.image : ""}
                    className="rounded-md"
                  />
                )}
                <p className="text-center mt-2">
                  {room.balcony.balconyState ? "Available" : "Not Available"}
                </p>
              </div>
            </div>
            <div className="overflow-x-scroll w-full">
              <p className="text-lg font-bold text-center mb-5">
                Selected Seats
              </p>
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
                        ).displayRent
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
              // <div className="flex items-center justify-center gap-3 mt-6">
              //   <p className="md:font-medium underline">
              //     বুকিং কনফার্ম করতে পাশের বাটনে ক্লিক করে বুকিং চার্জ -{" "}
              //     {selectedSeat.reduce(
              //       (a, c) =>
              //         a +
              //         c.singleRoom.beds.find((bed) => bed.bedNo == c.bedNo)
              //           .bookingCharge,
              //       0
              //     )}{" "}
              //     টাকা পরিশোধ করুনঃ
              //   </p>
              //   {/* <Link href={"/rooms"}> */}
              //   <button className="duration-300 px-3 py-1 bg-green-600 text-white font-medium active:scale-90 cursor-pointer select-none inline-block w-max">
              //     Pay Booking Charge
              //   </button>
              //   {/* </Link> */}
              // </div>
              <div className="flex items-center justify-center gap-3 mt-6">
                <p className="md:font-medium underline">
                  বুকিং কনফার্ম করতে পাশের বাটনে ক্লিক করুনঃ
                </p>
                {/* <Link href={"/rooms"}> */}
                <button
                  onClick={() => setShowForm(true)}
                  className="duration-300 px-3 py-1 bg-green-600 text-white font-medium active:scale-90 cursor-pointer select-none inline-block w-max"
                >
                  Confirm Booking
                </button>
                {/* </Link> */}
              </div>
            )}
          </div>
        </div>
        {/* <div dangerouslySetInnerHTML={{ __html: emVideo }} /> */}
      </div>
    </>
  );
};

export default Component;
