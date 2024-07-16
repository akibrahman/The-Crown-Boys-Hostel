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
          rent: { userRent: 0, displayRent: 0 },
          bookingCharge: 0,
          bedNo: "",
          isBooked: false,
          image: { src: "", path: "", file: "" },
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

  const openUpdatingModal = () => {
    setUpdatingModal(true);
  };

  const closeUpdatingModal = () => {
    setUpdatingModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //
    const uploadFile = (file, path) => {
      return new Promise((resolve, reject) => {
        const storageRef = ref(storage, path);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(progress);
            setProgress(parseInt(progress));
          },
          (error) => {
            console.log(error);
            toast.error("Firebase error");
            reject(error);
          },
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({ src: url, path });
          }
        );
      });
    };
    openUpdatingModal();
    setuploading([true, "firebase"]);
    try {
      // Room Image
      let roomImageUpload = Promise.resolve(null);
      if (roomData.image.file) {
        const roomImagePath = `rooms/${roomData.name}/image/${roomData.name}.jpg`;
        roomImageUpload = uploadFile(roomData.image.file, roomImagePath);
      }
      // Room Video
      let roomVideoUpload = Promise.resolve(null);
      if (roomData.video.file) {
        const roomVideoPath = `rooms/${roomData.name}/video/${roomData.name}.mp4`;
        roomVideoUpload = uploadFile(roomData.video.file, roomVideoPath);
      }

      // Room Sketch
      let roomSketchUpload = Promise.resolve(null);
      if (roomData.sketch.file) {
        const roomSketchPath = `rooms/${roomData.name}/sketch/${roomData.name}-sketch.jpg`;
        roomSketchUpload = uploadFile(roomData.sketch.file, roomSketchPath);
      }

      // Room Toilet Image
      let roomToiletImageUpload = Promise.resolve(null);
      if (roomData.toilet.image.file) {
        const roomToiletImagePath = `rooms/${roomData.name}/image/${roomData.name}-toilet.jpg`;
        roomToiletImageUpload = uploadFile(
          roomData.toilet.image.file,
          roomToiletImagePath
        );
      }

      // Room Balcony Image
      let roomBalconyImageUpload = Promise.resolve(null);
      if (roomData.balcony.balconyState && roomData.balcony.image.file) {
        const roomBalconyImagePath = `rooms/${roomData.name}/image/${roomData.name}-balcony.jpg`;
        roomBalconyImageUpload = uploadFile(
          roomData.balcony.image.file,
          roomBalconyImagePath
        );
      }

      // Room Beds Image
      const roomBedsImageUploads = roomData.beds.map((bed, i) => {
        if (bed.image.file) {
          const roomBedsImagePath = `rooms/${roomData.name}/image/${roomData.name}-${bed.bedNo}.jpg`;
          return uploadFile(bed.image.file, roomBedsImagePath);
        } else {
          return { src: bed.image.src, path: bed.image.path };
        }
      });
      const [
        roomBalconyImageUploadData,
        roomToiletImageUploadData,
        roomSketchUploadData,
        roomImageUploadData,
        roomVideoUploadData,
        ...roomBedsImageData
      ] = await Promise.all([
        roomBalconyImageUpload,
        roomToiletImageUpload,
        roomSketchUpload,
        roomImageUpload,
        roomVideoUpload,
        ...roomBedsImageUploads,
      ]);
      const finalData = {
        _id: id,
        roomName: roomData.name,
        roomType: roomData.type,
        roomFloor: roomData.floor,
        roomToiletType: roomData.toilet.toiletType,
        roomBalconyState: roomData.balcony.balconyState,
        roomBeds: roomData.beds.map((bed, i) => {
          return { ...bed, image: roomBedsImageData[i] };
        }),
      };
      console.log(finalData);

      setuploading([true, "backend"]);
      try {
        const { data } = await axios.put("/api/room", finalData);
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
        isOpen={updatingModal}
        // onRequestClose={closeModal}
        style={customStyles2}
      >
        <div className="px-32 py-20">
          {uploading[0] && uploading[1] == "firebase" && (
            <div className="flex items-center gap-3">
              <p className="text-dashboard font-semibold">Uploading Assets</p>
              <CgSpinner className="text-xl text-dashboard animate-spin" />
            </div>
          )}
          {uploading[0] && uploading[1] == "backend" && (
            <div className="flex items-center gap-3">
              <p className="text-dashboard font-semibold">Making room ready</p>
              <CgSpinner className="text-xl text-dashboard animate-spin" />
            </div>
          )}
          <div className="flex items-center justify-center mt-5">
            <div class="relative w-20 h-20">
              <svg class="w-full h-full" viewBox="0 0 100 100">
                <circle
                  class="text-gray-200 stroke-current"
                  stroke-width="10"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                ></circle>
                <circle
                  class="text-sky-500  progress-ring__circle stroke-current"
                  stroke-width="10"
                  stroke-linecap="round"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke-dasharray="251.2"
                  stroke-dashoffset={`calc(251.2 - (251.2 * ${progress}) / 100)`}
                ></circle>
                <text
                  x="50"
                  y="50"
                  fill="#1F2937"
                  font-family="Verdana"
                  font-size="15"
                  fontWeight="bold"
                  text-anchor="middle"
                  alignment-baseline="middle"
                >
                  {progress} %
                </text>
              </svg>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <div className="mx-auto p-6 bg-dashboard text-slate-100">
          <h1 className="text-2xl font-bold mb-4 text-center">Update Room</h1>
          <form onSubmit={handleSubmit} className="shadow-md rounded-lg p-6">
            {/* Room Information Fields */}
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 md:gap-0 bg-gray-600 p-4 rounded-md mb-4">
              <div className="flex flex-col gap-2">
                <label className="block text-slate-100 font-semibold">
                  Room Name
                </label>
                <select
                  className="px-4 py-1.5 rounded-md font-medium text-gray-500 outline-none"
                  required
                  disabled
                  // onChange={handleChange}
                  value={roomData.name}
                  name="name"
                >
                  <option value="">Select Name</option>
                  <option value="a1">A1</option>
                  <option value="a2">A2</option>
                  <option value="a3">A3</option>
                  <option value="a4">A4</option>
                  <option value="a5">A5</option>
                  <option value="a6">A6</option>
                  <option value="b1">B1</option>
                  <option value="b2">B2</option>
                  <option value="b3">B3</option>
                  <option value="b4">B4</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="block text-slate-100 font-semibold">
                  Type
                </label>
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
                  // onChange={handleChange}
                  disabled
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
                <label className="block text-slate-100 text-lg font-semibold">
                  Video
                </label>
                <video
                  src={roomData.video.src}
                  title={`Room ${roomData.name} Video`}
                  className="aspect-auto rounded-md"
                  height={50}
                  width={200}
                  controls
                ></video>
                <label htmlFor="video">
                  <FaPencil className="border-2 rounded-full p-1 text-3xl border-dashboard text-slate-100 cursor-pointer" />
                </label>
                <input
                  hidden
                  type="file"
                  name="video"
                  id="video"
                  accept="video/*"
                  onChange={(e) => {
                    setRoomData((prevData) => ({
                      ...prevData,
                      video: {
                        ...roomData.video,
                        src: URL.createObjectURL(e.target.files[0]),
                        file: e.target.files[0],
                      },
                    }));
                  }}
                  className="mt-1 p-2 w-full border rounded-md"
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
                    className="block text-slate-100 font-semibold"
                  >
                    Balcony Image
                  </label>
                  {roomData.balcony.image.src ? (
                    <>
                      <Image
                        unoptimized={true}
                        src={roomData.balcony.image.src}
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
                              image: {
                                ...roomData.balcony.image,
                                src: "",
                                file: null,
                              },
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
                          image: {
                            ...roomData.balcony.image,
                            src: URL.createObjectURL(e.target.files[0]),
                            file: e.target.files[0],
                          },
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
                {roomData.sketch.src ? (
                  <>
                    <Image
                      unoptimized={true}
                      src={roomData.sketch.src}
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
                          sketch: {
                            ...roomData.sketch,
                            src: "",
                            file: null,
                          },
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
                      sketch: {
                        ...roomData.sketch,
                        src: URL.createObjectURL(e.target.files[0]),
                        file: e.target.files[0],
                      },
                    }));
                  }}
                  className="mt-1 p-2 w-full border rounded-md"
                />
              </div>

              <div htmlFor="image" className="flex flex-col items-center gap-2">
                <label className="block text-slate-100 font-semibold">
                  Room Image
                </label>
                {roomData.image.src ? (
                  <>
                    <Image
                      unoptimized={true}
                      src={roomData.image.src}
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
                          image: {
                            ...roomData.image,
                            src: "",
                            file: null,
                          },
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
                      image: {
                        ...roomData.image,
                        src: URL.createObjectURL(e.target.files[0]),
                        file: e.target.files[0],
                      },
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
                {roomData.toilet.image.src ? (
                  <>
                    <Image
                      unoptimized={true}
                      src={roomData.toilet.image.src}
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
                            image: {
                              ...roomData.toilet.image,
                              src: "",
                              file: null,
                            },
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
                        image: {
                          ...roomData.toilet.image,
                          src: URL.createObjectURL(e.target.files[0]),
                          file: e.target.files[0],
                        },
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

                    {bed.image.src ? (
                      <>
                        <Image
                          unoptimized={true}
                          src={bed.image.src}
                          alt={`Room ${roomData.name} Bed ${bed.bedNo}`}
                          width={100}
                          height={130}
                          className="w-[100px] h-[130px] rounded-md"
                        />
                        <FaTimes
                          className="text-xl text-dashboard duration-300 cursor-pointer active:scale-90"
                          onClick={() => {
                            const beds = [...roomData.beds];
                            beds[index].image.src = "";
                            beds[index].image.file = null;
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
                        beds[index].image.src = URL.createObjectURL(files[0]);
                        beds[index].image.file = files[0];
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
