"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { FaDownload, FaPlus, FaTimes } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import Image from "next/image";
import Modal from "react-modal";
import { CgSpinner } from "react-icons/cg";
import { useQuery } from "@tanstack/react-query";
import DraggableBed from "@/Components/RoomSketch/DraggableBed";

const ManagerAddARoom = () => {
  const [uploading, setuploading] = useState(false);
  const [error, setError] = useState("");
  const [bedPlacementModalIsOpen, setBedPlacementModalIsOpen] = useState(false);
  const [roomDuplicateModalIsOpen, setRoomDuplicateModalIsOpen] =
    useState(false);

  const openBedPlacementModal = () => {
    setBedPlacementModalIsOpen(true);
  };

  const closeBedPlacementModal = () => {
    setBedPlacementModalIsOpen(false);
  };

  const openRoomDuplicateModal = () => {
    setRoomDuplicateModalIsOpen(true);
  };

  const closeRoomDuplicateModal = () => {
    setRoomDuplicateModalIsOpen(false);
  };

  const { data: buildings } = useQuery({
    queryKey: ["buildings", "add_room"],
    queryFn: async () => {
      const { data } = await axios.get("/api/buildings");
      if (data.success) return data.buildings;
      else return [];
    },
  });

  const [roomData, setRoomData] = useState({
    name: "",
    buildingName: "",
    block: "",
    video: "",
    type: "",
    sketch: "",
    floor: "",
    image: "",
    toilet: { type: "", image: "" },
    balcony: { state: false, image: "" },
    beds: [
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
  });

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
    beds[index][name] = value.toLowerCase();
    setRoomData((prevData) => ({
      ...prevData,
      beds,
    }));
  };

  const addBed = () => {
    setError("");
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

  const finalSubmit = async (e) => {
    e.preventDefault();
    // return;
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
    setuploading(true);
    try {
      const dataToSend = new FormData();
      dataToSend.append("roomName", roomData.name.toLowerCase());
      dataToSend.append("buildingName", roomData.buildingName);
      dataToSend.append("block", roomData.block.toLowerCase());
      dataToSend.append("roomType", roomData.type);
      dataToSend.append("roomFloor", roomData.floor);
      dataToSend.append("roomToiletType", roomData.toilet.type);
      dataToSend.append("roomBalconyState", roomData.balcony.state);
      dataToSend.append("roomVideo", roomData.video);
      dataToSend.append("roomImage", roomData.image);
      dataToSend.append("roomSketch", roomData.sketch);
      dataToSend.append("roomToilet", roomData.toilet.image);
      dataToSend.append("roomBalcony", roomData.balcony.image);
      dataToSend.append("beds", roomData.beds.length);
      roomData.beds.forEach((bed, i) => {
        const { image, ...rest } = bed;
        dataToSend.append(`bedData-${i + 1}`, JSON.stringify(rest));
        dataToSend.append(`bedImage-${i + 1}`, image);
      });
      const { data } = await axios.post("/api/room", dataToSend);
      if (!data.success) throw new Error(data.msg);
      setRoomData({
        name: "",
        buildingName: "",
        block: "",
        video: "",
        type: "",
        sketch: "",
        floor: 0,
        image: "",
        toilet: { type: "", image: "" },
        balcony: { state: false, image: "" },
        beds: [
          {
            user: "",
            userRent: 0,
            displayRent: 0,
            bookingCharge: 0,
            bedNo: "",
            isBooked: false,
            image: "",
            left: "",
            top: "",
          },
        ],
      });
      setuploading(false);
      toast.success(data.msg);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error uploading files:", error);
      setuploading(false);
      toast.error("Error Adding the Room, Try again!");
    } finally {
      closeBedPlacementModal();
    }
  };

  const openBedPlacement = () => {
    if (!roomData.sketch) return;
    if (roomData.beds.length == 0) return;
    openBedPlacementModal();
  };

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      padding: "30",
    },
    overlay: {
      zIndex: 500,
      backgroundColor: "rgba(0,0,0,0.6)",
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
      padding: "30",
      width: "90%",
      height: "90%",
    },
    overlay: {
      zIndex: 500,
      backgroundColor: "rgba(0,0,0,0.6)",
    },
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

  return (
    <>
      {/*// Room Duplicate Modal */}
      <Modal
        isOpen={roomDuplicateModalIsOpen}
        onRequestClose={closeRoomDuplicateModal}
        style={customStyles2}
      >
        {roomDuplicateModalIsOpen && (
          <div className="relative px-32 py-20">
            <FaTimes
              onClick={closeRoomDuplicateModal}
              className="text-xl absolute top-4 right-4 cursor-pointer duration-300 active:scale-90"
            />
            <button className="mt-2 bg-blue-500 text-white p-2 rounded block mx-auto">
              Duplicate
            </button>
          </div>
        )}
      </Modal>
      {/*// Bed Placement Modal */}
      <Modal
        isOpen={bedPlacementModalIsOpen}
        onRequestClose={closeBedPlacementModal}
        style={customStyles}
      >
        {bedPlacementModalIsOpen && (
          <div className="relative px-32 py-20">
            <FaTimes
              onClick={closeBedPlacementModal}
              className="text-xl absolute top-4 right-4 cursor-pointer duration-300 active:scale-90"
            />
            <div className="relative room-container w-[350px] h-[430px] border">
              <img
                src={roomData?.sketch && URL.createObjectURL(roomData.sketch)}
                alt="Room Sketch"
                className="w-full h-full object-contain"
              />
              {roomData.beds.map((bed, i) => (
                <DraggableBed
                  key={i}
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
      <div className="container min-h-full bg-dashboard text-white mx-auto p-6 duration-300">
        <h1 className="text-2xl font-bold mb-4 text-center">Add Room</h1>
        <p
          onClick={openRoomDuplicateModal}
          className="text-center text-primary font-medium cursor-pointer underline hover:font-semibold duration-300"
        >
          Would you like to add the same room in the same building but on a
          different floor?
        </p>
        <form onSubmit={finalSubmit} className="shadow-md rounded-lg p-6">
          {/* Room Information Fields */}
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 md:gap-0 bg-gray-600 p-4 rounded-md mb-4">
            <div className="flex flex-col gap-2">
              <label className="block text-slate-100 font-semibold">
                Room Name
              </label>
              <input
                placeholder="Room Name"
                type="text"
                className="px-4 py-1.5 rounded-md font-medium text-gray-500 outline-none"
                required
                onChange={handleChange}
                value={roomData.name}
                name="name"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="block text-slate-100 font-semibold">Type</label>
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
              <label className="block text-slate-100 font-semibold">
                Floor
              </label>
              <select
                className="px-4 py-1.5 rounded-md font-medium text-gray-500 outline-none"
                required
                onChange={handleChange}
                value={roomData.floor}
                name="floor"
                id=""
              >
                <option value="">Select Floor</option>
                <option value="0">Ground Floor</option>
                <option value="1">First Floor</option>
                <option value="2">Second Floor</option>
                <option value="3">Third Floor</option>
                <option value="4">Fourth Floor</option>
                <option value="5">Fifth Floor</option>
                <option value="6">Sixth Floor</option>
                <option value="7">Seventh Floor</option>
                <option value="8">Eighth Floor</option>
                <option value="9">Nineth Floor</option>
                <option value="10">Tenth Floor</option>
                <option value="11">Eleventh Floor</option>
                <option value="12">Twelveth Floor</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="block text-slate-100 font-semibold">
                Toilet Type
              </label>
              <select
                className="px-4 py-1.5 rounded-md font-medium text-gray-500 outline-none"
                onChange={(e) =>
                  setRoomData((prevData) => ({
                    ...prevData,
                    toilet: { ...prevData.toilet, type: e.target.value },
                  }))
                }
                value={roomData.toilet.type}
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
            <div className="flex flex-col gap-2">
              <label className="block text-slate-100 font-semibold">
                Building Name
              </label>
              <select
                className="px-4 py-1.5 rounded-md font-medium text-gray-500 outline-none"
                required
                onChange={handleChange}
                value={roomData.buildingName}
                name="buildingName"
              >
                <option value="">Select Buildiing</option>
                {buildings?.map((building) => (
                  <option key={building._id} value={building._id}>
                    {building.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="block text-slate-100 font-semibold">
                Block
              </label>
              <input
                placeholder="Block"
                type="text"
                className="px-4 py-1.5 rounded-md font-medium text-gray-500 outline-none"
                required
                onChange={handleChange}
                value={roomData.block}
                name="block"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="block text-slate-100 font-semibold">
                Video
              </label>
              <input
                placeholder="Youtube Embedded iFrame"
                type="text"
                className="px-4 py-1.5 rounded-md font-medium text-gray-500 outline-none"
                required
                onChange={handleChange}
                value={roomData.video}
                name="video"
              />
            </div>

            <div className="flex items-center justify-center gap-3">
              <label className="block text-slate-100 font-semibold">
                Balcony
              </label>
              <span
                onClick={() => {
                  setRoomData((prevData) => ({
                    ...prevData,
                    balcony: {
                      ...prevData.balcony,
                      state: !roomData.balcony.state,
                    },
                  }));
                }}
                className="relative w-6 h-6 flex items-center justify-center bg-white border-2 border-gray-300 rounded-md transition-colors duration-200 ease-in-out cursor-pointer"
              >
                <svg
                  className={`w-4 h-4 text-green-500 transition-opacity duration-200 ease-in-out ${
                    roomData.balcony.state ? "opacity-100" : "opacity-0"
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

            {roomData.balcony.state && (
              <div className="flex flex-col items-center gap-2">
                <label
                  htmlFor="balcony.image"
                  className="block text-slate-100 font-semibold"
                >
                  Balcony Image
                </label>
                {roomData.balcony.image ? (
                  <>
                    <Image
                      src={URL.createObjectURL(roomData.balcony.image)}
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
                  accept="image/*"
                  type="file"
                  name="balcony.image"
                  id="balcony.image"
                  onChange={(e) => {
                    setError("");
                    setRoomData((prevData) => ({
                      ...prevData,
                      balcony: {
                        ...prevData.balcony,
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
                className="block text-slate-100 font-semibold"
              >
                Room Sketch
              </label>
              {roomData.sketch ? (
                <>
                  <Image
                    src={URL.createObjectURL(roomData.sketch)}
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
              <a
                href="/images/sketch/a4-sketch.png"
                download="a4-sketch.png"
                className="text-white font-semibold text-sm underline flex items-center justify-center gap-1 hover:text-sky-300"
              >
                Default Sketch <FaDownload />
              </a>
              <input
                hidden
                type="file"
                name="sketch"
                id="sketch"
                accept="image/*"
                onChange={(e) => {
                  setError("");
                  setRoomData((prevData) => ({
                    ...prevData,
                    sketch: e.target.files[0],
                  }));
                }}
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>

            <div htmlFor="image" className="flex flex-col items-center gap-2">
              <label className="block text-slate-100 font-semibold">
                Room Image
              </label>
              {roomData.image ? (
                <>
                  <Image
                    src={URL.createObjectURL(roomData.image)}
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
                  setError("");
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
                className="block text-slate-100 font-semibold"
              >
                Toilet Image
              </label>
              {roomData.toilet.image ? (
                <>
                  <Image
                    src={URL.createObjectURL(roomData.toilet.image)}
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
                        toilet: { ...prevData.toilet, image: "" },
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
                accept="image/*"
                onChange={(e) => {
                  setError("");

                  setRoomData((prevData) => ({
                    ...prevData,
                    toilet: { ...prevData.toilet, image: e.target.files[0] },
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
                  <label className="block text-slate-100 font-semibold">
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
                  <label className="block text-slate-100 font-semibold">
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
                  <label className="block text-slate-100 font-semibold">
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
                  <label className="block text-slate-100 font-semibold">
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
                  <label className="block text-slate-100 font-semibold">
                    Bed Image
                  </label>

                  {bed.image ? (
                    <>
                      <Image
                        src={URL.createObjectURL(bed.image)}
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
                    accept="image/*"
                    onChange={(e) => {
                      setError("");
                      const { name, files } = e.target;
                      const beds = [...roomData.beds];
                      beds[index][name] = files[0];
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

          <div className="flex items-center justify-center gap-6 mt-6">
            <button
              disabled={
                !roomData.sketch || roomData.beds.length == 0 || uploading
              }
              type="button"
              className="bg-green-500 disabled:bg-gray-500 text-white px-4 py-2 rounded-md mx-auto block"
              onClick={openBedPlacement}
            >
              Bed Placement
            </button>
            <button
              disabled={
                roomData.beds.find((b) => !b.top && !b.left) || uploading
              }
              type="submit"
              className="bg-primary disabled:bg-gray-500 text-white px-4 py-2 rounded-md mx-auto flex items-center justify-center gap-4"
            >
              Submit{" "}
              {uploading && <CgSpinner className="text-xl animate-spin" />}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ManagerAddARoom;
