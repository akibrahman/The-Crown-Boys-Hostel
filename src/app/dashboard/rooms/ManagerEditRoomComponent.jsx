"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaDeleteLeft, FaPencil } from "react-icons/fa6";
import Modal from "react-modal";
import { storage } from "../../../../firebase.config";
import { FaPlus, FaTimes } from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";
import DraggableBed from "@/Components/RoomSketch/DraggableBed";

const ManagerEditRoomComponent = ({ id, modalIsOpen, closeModal, refetch }) => {
  const { data: room } = useQuery({
    queryKey: ["Room", "Manager Only", id],
    queryFn: async ({ queryKey }) => {
      const { data } = await axios.get(`/api/room?id=${queryKey[2]}`);
      if (data.success) {
        return data.rooms[0];
      } else {
        return null;
      }
    },
    enabled: id ? true : false,
  });

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      // backgroundColor: "#000",
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

  const customStyles2 = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      // backgroundColor: "#000",
      // border: "1px solid #EAB308",
      padding: "30",
      //   width: "90%",
      // overflow: "scroll",
      //   height: "90%",
    },
    overlay: {
      zIndex: 600,
      backgroundColor: "rgba(0,0,0,0.6)",
    },
  };

  const [uploading, setuploading] = useState([false, ""]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const [roomData, setRoomData] = useState(room);
  useEffect(() => setRoomData(room), [room]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoomData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleBedChange = (index, e) => {
    const { name, value } = e.target;
    const beds = [...roomData.beds];
    beds[index][name] = value;
    setRoomData((prevData) => ({
      ...prevData,
      beds,
    }));
  };
  const addBed = () => {
    setRoomData((prevData) => ({
      ...prevData,
      beds: [
        ...prevData.beds,
        {
          user: "",
          userRent: 0,
          displayRent: 0,
          bookingCharge: 0,
          bedNo: "",
          isBooked: false,
          image: "",
          top: "",
          left: "",
        },
      ],
    }));
  };
  const removeBed = (index) => {
    const beds = [...roomData.beds];
    beds.splice(index, 1);
    setRoomData((prevData) => ({
      ...prevData,
      beds,
    }));
  };

  const [updatingModal, setUpdatingModal] = useState(false);
  const [isOpenBedPlacementModal, setIsOpenBedPlacementModal] = useState(false);

  const openBedPlacementModal = () => {
    setIsOpenBedPlacementModal(true);
  };
  const closeBedPlacementModal = () => {
    setIsOpenBedPlacementModal(false);
  };
  const openBedPlacement = () => {
    if (!roomData.sketch) return;
    if (roomData.beds.length == 0) return;
    openBedPlacementModal();
  };
  const updateBedPosition = (bedNo, top, left) => {
    let beds = [...roomData.beds];
    beds = beds.map((b) =>
      b.bedNo == bedNo ? { ...b, top: `${top}%`, left: `${left}%` } : b
    );
    setRoomData((prevData) => ({
      ...prevData,
      beds,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomData.video) {
      setError("Room Video is required, Add one");
      return;
    }
    if (!roomData.sketch) {
      setError("Room Sketch is required, Add one");
      return;
    }
    if (!roomData.image) {
      setError("Room Image is required, Add one");
      return;
    }
    if (!roomData.toilet.image) {
      setError("Toilet Image is required, Add one");
      return;
    }
    if (roomData.beds.length == 0) {
      setError("Atleast one bed should be added, Add one");
      return;
    }
    if (roomData.balcony.state && !roomData.balcony.image) {
      setError("Balcony Image is required, Add one");
      return;
    }
    for (let bed of roomData.beds) {
      if (!bed.image) {
        setError(`Add Image to bed no: ${bed.bedNo}`);
        return;
      }
    }
    // openUpdatingModal();
    // setuploading([true, "firebase"]);
    try {
      const dataToSend = new FormData();
      dataToSend.append("_id", id);
      dataToSend.append("roomType", roomData.type);
      dataToSend.append("roomToiletType", roomData.toilet.toiletType);
      dataToSend.append("roomVideo", roomData.video);
      dataToSend.append("roomBalconyState", roomData.balcony.balconyState);
      dataToSend.append("roomImage", roomData.image);
      dataToSend.append("roomSketch", roomData.sketch);
      dataToSend.append("roomToilet", roomData.toilet.image);
      dataToSend.append(
        "roomBalcony",
        roomData.balcony.balconyState ? roomData.balcony.image : ""
      );
      dataToSend.append("beds", roomData.beds.length);
      roomData.beds.forEach((bed, i) => {
        const { image, ...rest } = bed;
        dataToSend.append(`bedData-${i + 1}`, JSON.stringify(rest));
        dataToSend.append(`bedImage-${i + 1}`, image);
      });

      const { data } = await axios.put("/api/room", dataToSend);
      if (!data.success) throw new Error(data.msg);
      await refetch();
      setuploading([false, ""]);
      setRoomData({});
      closeModal();
      toast.success(data.msg);

      return;

      // dataToSend.append("beds", roomData.beds.length);
      const finalData = {
        _id: id,
        roomType: roomData.type,
        roomToiletType: roomData.toilet.toiletType,
        roomBalconyState: roomData.balcony.balconyState,
        roomBeds: roomData.beds.map((bed, i) => {
          return { ...bed };
        }),
      };
      setuploading([true, "backend"]);
      try {
        if (data.success) {
          await refetch();
          closeUpdatingModal();
          setuploading([false, ""]);
          setRoomData({});
          closeModal();
          toast.success(data.msg);
        }
      } catch (error) {
        console.error("Server error", error);
        closeUpdatingModal();
        setuploading([false, ""]);
        toast.error(error.response.data.msg);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      closeUpdatingModal();
      setuploading([false, ""]);
      toast.error("Error uploading the assets to Firebase, Try again!");
    }
  };

  if (!id) {
    closeModal();
    return;
  }
  if (!roomData) return;
  return (
    <>
      <Modal
        isOpen={isOpenBedPlacementModal}
        onRequestClose={closeBedPlacementModal}
        style={customStyles2}
      >
        {isOpenBedPlacementModal && (
          <div className="relative px-32 py-20">
            <FaTimes
              onClick={closeBedPlacementModal}
              className="text-xl absolute top-4 right-4 cursor-pointer duration-300 active:scale-90"
            />
            <div className="relative room-container w-[350px] h-[430px] border">
              <img
                src={
                  roomData?.sketch && roomData?.sketch instanceof File
                    ? URL.createObjectURL(roomData.sketch)
                    : roomData.sketch
                }
                alt="Room Sketch"
                className="w-full h-full object-contain"
              />
              {roomData.beds.map((bed) => (
                <DraggableBed
                  key={bed.bedNo}
                  bed={bed}
                  onPositionChange={updateBedPosition}
                />
              ))}
              <button
                onClick={closeBedPlacementModal}
                className="mt-2 bg-blue-500 text-white p-2 rounded block mx-auto"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </Modal>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <div className="mx-auto p-6 bg-dashboard text-white">
          <h1 className="text-2xl font-bold mb-4 text-center">Update Room</h1>
          <form onSubmit={handleSubmit} className="shadow-md rounded-lg p-6">
            {/* Room Information Fields */}
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 md:gap-0 bg-gray-600 p-4 rounded-md mb-4">
              <div className="flex flex-col gap-2">
                <label className="block text-white font-semibold">
                  Room Name
                </label>
                <input
                  placeholder="Room Name"
                  type="text"
                  className="px-4 py-1.5 rounded-md font-medium outline-none"
                  required
                  disabled
                  value={roomData.name.toUpperCase().split("").join(" ")}
                  name="name"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="block text-white font-semibold">Type</label>
                <select
                  className="px-4 py-1.5 rounded-md font-medium text-gray-500 outline-none"
                  required
                  onChange={handleChange}
                  value={roomData.type}
                  name="type"
                >
                  <option value="">Select Type</option>
                  <option value="concrete">Concrete</option>
                  <option value="board">Board</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="block text-white font-semibold">Floor</label>
                <input
                  placeholder="Room Name"
                  type="text"
                  className="px-4 py-1.5 rounded-md font-medium outline-none"
                  required
                  disabled
                  value={roomData.floor}
                  name="name"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="block text-white font-semibold">
                  Toilet Type
                </label>
                <select
                  className="px-4 py-1.5 rounded-md font-medium text-gray-500 outline-none"
                  onChange={(e) =>
                    setRoomData((prevData) => ({
                      ...prevData,
                      toilet: {
                        ...prevData.toilet,
                        toiletType: e.target.value,
                      },
                    }))
                  }
                  value={roomData.toilet.toiletType}
                  name="toilet.type"
                  required
                  id=""
                >
                  <option value="">Select Toilet Type</option>
                  <option value="attached">Attached</option>
                  <option value="common">Common</option>
                </select>
              </div>
            </div>

            <div className="mb-4 bg-gray-600 rounded-md flex flex-col md:flex-row items-center justify-center md:justify-around gap-4 md:gap-0 p-4">
              <div className="flex flex-col items-center gap-2 p-4">
                <label className="block text-white text-lg font-semibold">
                  Video
                </label>
                <input
                  placeholder="Youtube Embedded iFrame"
                  type="text"
                  className="px-4 py-1.5 rounded-md font-medium text-gray-500 outline-none w-[500px]"
                  required
                  onChange={handleChange}
                  value={roomData.video}
                  name="video"
                />
              </div>

              <div className="flex items-center justify-center gap-3">
                <label className="block text-white font-semibold">
                  Balcony
                </label>
                <span
                  onClick={() => {
                    setRoomData((prevData) => ({
                      ...prevData,
                      balcony: {
                        ...prevData.balcony,
                        balconyState: !roomData.balcony.balconyState,
                      },
                    }));
                  }}
                  className="relative w-6 h-6 flex items-center justify-center bg-white border-2 border-gray-300 rounded-md transition-colors duration-200 ease-in-out cursor-pointer"
                >
                  <svg
                    className={`w-4 h-4 text-green-500 transition-opacity duration-200 ease-in-out ${
                      roomData.balcony.balconyState
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </span>
              </div>

              {roomData.balcony.balconyState && (
                <div className="flex flex-col items-center gap-2">
                  <label
                    htmlFor="balcony.image"
                    className="block text-white font-semibold"
                  >
                    Balcony Image
                  </label>
                  {roomData.balcony.image ? (
                    <>
                      <Image
                        unoptimized={true}
                        src={
                          roomData.balcony.image instanceof File
                            ? URL.createObjectURL(roomData.balcony.image)
                            : roomData.balcony.image
                        }
                        alt={`Room ${roomData.name} Balcony`}
                        width={100}
                        height={130}
                        className="w-[100px] h-[130px] rounded-md"
                      />
                      <FaTimes
                        className="text-xl text-dashboard duration-300 cursor-pointer active:scale-90"
                        onClick={() => {
                          setRoomData((prevData) => ({
                            ...prevData,
                            balcony: {
                              ...prevData.balcony,
                              image: "",
                            },
                          }));
                        }}
                      />
                    </>
                  ) : (
                    <label
                      htmlFor="balcony.image"
                      className="w-[100px] h-[130px] border-2 border-slate-100 border-dashed rounded-md cursor-pointer flex items-center justify-center hover:scale-105 active:scale-90 duration-300"
                    >
                      <FaPlus className="text-xl text-dashboard" />
                    </label>
                  )}
                  <input
                    hidden
                    type="file"
                    name="balcony.image"
                    id="balcony.image"
                    onChange={(e) => {
                      setRoomData((prevData) => ({
                        ...prevData,
                        balcony: {
                          ...roomData.balcony,
                          image: e.target.files[0],
                        },
                      }));
                    }}
                    className="mt-1 p-2 w-full border rounded-md"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center md:justify-around gap-4 md:gap-0 bg-gray-600 p-4 rounded-md mb-4">
              <div className="flex flex-col items-center gap-2">
                <label
                  htmlFor="sketch"
                  className="block text-white font-semibold"
                >
                  Room Sketch
                </label>
                {roomData.sketch ? (
                  <>
                    <Image
                      unoptimized={true}
                      src={
                        roomData.sketch instanceof File
                          ? URL.createObjectURL(roomData.sketch)
                          : roomData.sketch
                      }
                      alt={`Room ${roomData.name} Sketch`}
                      width={100}
                      height={130}
                      className="w-[100px] h-[130px] rounded-md"
                    />
                    <FaTimes
                      className="text-xl text-dashboard duration-300 cursor-pointer active:scale-90"
                      onClick={() =>
                        setRoomData((prevData) => ({
                          ...prevData,
                          sketch: "",
                        }))
                      }
                    />
                  </>
                ) : (
                  <label
                    htmlFor="sketch"
                    className="w-[100px] h-[130px] border-2 border-slate-100 border-dashed rounded-md cursor-pointer flex items-center justify-center hover:scale-105 active:scale-90 duration-300"
                  >
                    <FaPlus className="text-xl text-dashboard" />
                  </label>
                )}

                <input
                  hidden
                  type="file"
                  name="sketch"
                  id="sketch"
                  accept="image/*"
                  onChange={(e) => {
                    setRoomData((prevData) => ({
                      ...prevData,
                      sketch: e.target.files[0],
                    }));
                  }}
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>

              <div htmlFor="image" className="flex flex-col items-center gap-2">
                <label className="block text-white font-semibold">
                  Room Image
                </label>
                {roomData.image ? (
                  <>
                    <Image
                      unoptimized={true}
                      src={
                        roomData.image instanceof File
                          ? URL.createObjectURL(roomData.image)
                          : roomData.image
                      }
                      alt={`Room ${roomData.name}`}
                      width={100}
                      height={130}
                      className="w-[100px] h-[130px] rounded-md"
                    />
                    <FaTimes
                      className="text-xl text-dashboard duration-300 cursor-pointer active:scale-90"
                      onClick={() =>
                        setRoomData((prevData) => ({
                          ...prevData,
                          image: "",
                        }))
                      }
                    />
                  </>
                ) : (
                  <label
                    htmlFor="image"
                    className="w-[100px] h-[130px] border-2 border-slate-100 border-dashed rounded-md cursor-pointer flex items-center justify-center hover:scale-105 active:scale-90 duration-300"
                  >
                    <FaPlus className="text-xl text-dashboard" />
                  </label>
                )}
                <input
                  hidden
                  type="file"
                  name="image"
                  id="image"
                  accept="image/*"
                  onChange={(e) => {
                    setRoomData((prevData) => ({
                      ...prevData,
                      image: e.target.files[0],
                    }));
                  }}
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>

              <div className="flex flex-col items-center gap-2">
                <label
                  htmlFor="toilet.image"
                  className="block text-white font-semibold"
                >
                  Toilet Image
                </label>
                {roomData.toilet.image ? (
                  <>
                    <Image
                      unoptimized={true}
                      src={
                        roomData.toilet.image instanceof File
                          ? URL.createObjectURL(roomData.toilet.image)
                          : roomData.toilet.image
                      }
                      alt={`Room ${roomData.name} Toilet`}
                      width={100}
                      height={130}
                      className="w-[100px] h-[130px] rounded-md"
                    />
                    <FaTimes
                      className="text-xl text-dashboard duration-300 cursor-pointer active:scale-90"
                      onClick={() =>
                        setRoomData((prevData) => ({
                          ...prevData,
                          toilet: {
                            ...prevData.toilet,
                            image: "",
                          },
                        }))
                      }
                    />
                  </>
                ) : (
                  <label
                    htmlFor="toilet.image"
                    className="w-[100px] h-[130px] border-2 border-slate-100 border-dashed rounded-md cursor-pointer flex items-center justify-center hover:scale-105 active:scale-90 duration-300"
                  >
                    <FaPlus className="text-xl text-dashboard" />
                  </label>
                )}
                <input
                  hidden
                  type="file"
                  name="toilet.image"
                  id="toilet.image"
                  onChange={(e) => {
                    setRoomData((prevData) => ({
                      ...prevData,
                      toilet: {
                        ...roomData.toilet,
                        image: e.target.files[0],
                      },
                    }));
                  }}
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-center gap-4 mb-4">
                <h3 className="text-lg font-medium">Beds</h3>
                <button
                  type="button"
                  onClick={addBed}
                  className="bg-blue-500 text-white p-2 rounded-full"
                >
                  <FaPlus className="text-2xl" />
                </button>
              </div>
              {roomData.beds.map((bed, index) => (
                <div
                  key={index}
                  className="bg-gray-600 p-4 rounded-md shadow-sm mb-4 flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 md:gap-3"
                >
                  <div className="flex flex-col gap-2">
                    <label className="block text-white font-semibold">
                      Bed No
                    </label>
                    <input
                      required
                      type="text"
                      name="bedNo"
                      value={bed.bedNo}
                      onChange={(e) => handleBedChange(index, e)}
                      className="px-4 py-1.5 w-full rounded-md outline-none font-medium text-gray-500"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="block text-white font-semibold">
                      User Rent
                    </label>
                    <input
                      required
                      type="number"
                      name="userRent"
                      value={bed.userRent}
                      onChange={(e) => handleBedChange(index, e)}
                      className="px-4 py-1.5 w-full rounded-md outline-none font-medium text-gray-500"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="block text-white font-semibold">
                      Display Rent
                    </label>
                    <input
                      required
                      type="number"
                      name="displayRent"
                      value={bed.displayRent}
                      onChange={(e) => handleBedChange(index, e)}
                      className="px-4 py-1.5 w-full rounded-md outline-none font-medium text-gray-500"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="block text-white font-semibold">
                      Booking Charge
                    </label>
                    <input
                      required
                      type="number"
                      name="bookingCharge"
                      value={bed.bookingCharge}
                      onChange={(e) => handleBedChange(index, e)}
                      className="px-4 py-1.5 w-full rounded-md outline-none font-medium text-gray-500"
                    />
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <label className="block text-white font-semibold">
                      Bed Image
                    </label>

                    {bed.image ? (
                      <>
                        <Image
                          unoptimized={true}
                          src={
                            bed.image instanceof File
                              ? URL.createObjectURL(bed.image)
                              : bed.image
                          }
                          alt={`Room ${roomData.name} Bed ${bed.bedNo}`}
                          width={100}
                          height={130}
                          className="w-[100px] h-[130px] rounded-md"
                        />
                        <FaTimes
                          className="text-xl text-dashboard duration-300 cursor-pointer active:scale-90"
                          onClick={() => {
                            const beds = [...roomData.beds];
                            beds[index].image = "";
                            setRoomData((prevData) => ({
                              ...prevData,
                              beds,
                            }));
                          }}
                        />
                      </>
                    ) : (
                      <label
                        htmlFor={`image-bed-${index}`}
                        className="w-[100px] h-[130px] border-2 border-slate-100 border-dashed rounded-md cursor-pointer flex items-center justify-center hover:scale-105 active:scale-90 duration-300"
                      >
                        <FaPlus className="text-xl text-dashboard" />
                      </label>
                    )}

                    <input
                      hidden
                      type="file"
                      name="image"
                      id={`image-bed-${index}`}
                      onChange={(e) => {
                        setError("");
                        const { name, files } = e.target;
                        const beds = [...roomData.beds];
                        beds[index].image = files[0];
                        setRoomData((prevData) => ({
                          ...prevData,
                          beds,
                        }));
                      }}
                      className="mt-1 p-2 w-full border rounded-md"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeBed(index)}
                    className="bg-red-500 text-white px-2 py-1 flex items-center justify-center rounded-md"
                  >
                    <FaDeleteLeft className="text-2xl" />
                  </button>
                </div>
              ))}
            </div>

            {error && (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-red-500 flex items-center justify-center rounded-full">
                  <FaTimes className="text-white text-sm" />
                </div>
                <p className="text-red-500 font-semibold">{error}</p>
              </div>
            )}

            <div className="flex items-center justify-center gap-20">
              <button
                type="button"
                className="bg-blue-500 text-white duration-300 active:scale-90 hover:scale-105 font-semibold px-4 py-2 rounded-md mx-auto block mt-6"
                onClick={openBedPlacement}
              >
                Bed Placement
              </button>
              <button
                type="submit"
                className="bg-green-500 text-white duration-300 active:scale-90 hover:scale-105 font-semibold px-4 py-2 rounded-md mx-auto block mt-6"
              >
                Submit
              </button>
              <button
                onClick={closeModal}
                type="button"
                className="bg-orange-500 text-white duration-300 active:scale-90 hover:scale-105 font-semibold px-4 py-2 rounded-md mx-auto block mt-6"
              >
                Cancle
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default ManagerEditRoomComponent;
