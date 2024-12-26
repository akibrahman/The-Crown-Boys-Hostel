// "use client";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useState } from "react";
import { storage } from "../../../../firebase.config";
import toast from "react-hot-toast";
import axios from "axios";
import { FaPlus, FaTimes } from "react-icons/fa";
import { FaDeleteLeft, FaPencil } from "react-icons/fa6";
import Image from "next/image";
import Modal from "react-modal";
import { CgSpinner } from "react-icons/cg";

const ManagerAddARoom = () => {
  const [uploading, setuploading] = useState([false, ""]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

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
    beds[index][name] = value;
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
          rent: { userRent: 0, displayRent: 0 },
          bookingCharge: 0,
          bedNo: "",
          isBooked: false,
          image: "",
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

  const handleSubmit = async (e) => {
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

    try {
      const { data } = await axios.post(
        `/api/room/check?name=${roomData.name}&floor=${roomData.floor}`
      );
      if (!data.success) throw new Error(data.msg);
    } catch (error) {
      console.log(error);
      return toast.error(error?.response?.data?.msg || error.message);
    }

    openModal();
    setuploading([true, "firebase"]);

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

    try {
      // Room Video
      const roomVideoPath = `rooms/${roomData.name}/video/${roomData.name}.mp4`;
      const roomVideoUpload = uploadFile(roomData.video, roomVideoPath);

      // Room Image
      const roomImagePath = `rooms/${roomData.name}/image/${roomData.name}.jpg`;
      const roomImageUpload = uploadFile(roomData.image, roomImagePath);

      // Room Sketch
      const roomSketchPath = `rooms/${roomData.name}/sketch/${roomData.name}-sketch.jpg`;
      const roomSketchUpload = uploadFile(roomData.sketch, roomSketchPath);

      // Room Toilet Image
      const roomToiletImagePath = `rooms/${roomData.name}/image/${roomData.name}-toilet.jpg`;
      const roomToiletImageUpload = uploadFile(
        roomData.toilet.image,
        roomToiletImagePath
      );

      // Room Balcony Image
      let roomBalconyImageUpload = Promise.resolve(null);
      if (roomData.balcony.state) {
        const roomBalconyImagePath = `rooms/${roomData.name}/image/${roomData.name}-balcony.jpg`;
        roomBalconyImageUpload = uploadFile(
          roomData.balcony.image,
          roomBalconyImagePath
        );
      }

      // Room Beds Image
      const roomBedsImageUploads = roomData.beds.map((bed, i) => {
        const roomBedsImagePath = `rooms/${roomData.name}/image/${roomData.name}-${bed.bedNo}.jpg`;
        return uploadFile(bed.image, roomBedsImagePath);
      });

      // Wait for all uploads to complete
      const [
        roomVideoData,
        roomImageData,
        roomSketchData,
        roomToiletImageData,
        roomBalconyImageData,
        ...roomBedsImageData
      ] = await Promise.all([
        roomVideoUpload,
        roomImageUpload,
        roomSketchUpload,
        roomToiletImageUpload,
        roomBalconyImageUpload,
        ...roomBedsImageUploads,
      ]);

      // Log srcData after all uploads are done
      const finalData = {
        roomName: roomData.name,
        buildingName: roomData.buildingName,
        block: roomData.block,
        roomType: roomData.type,
        roomFloor: roomData.floor,
        roomToiletType: roomData.toilet.type,
        roomBalconyState: roomData.balcony.state,
        roomVideoData: roomVideoData,
        roomImageData: roomImageData,
        roomSketchData: roomSketchData,
        roomToiletImageData,
        roomBalconyImageData,
        roomBeds: roomData.beds.map((bed, i) => {
          return { ...bed, image: roomBedsImageData[i] };
        }),
      };
      console.log(finalData);
      setuploading([true, "backend"]);
      try {
        const { data } = await axios.post("/api/room", finalData);
        if (data.success) {
          closeModal();
          setuploading([false, ""]);
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
              },
            ],
          });
          toast.success(data.msg);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      } catch (error) {
        console.error("Server error", error);
        setuploading([false, ""]);
        toast.error(error.response.data.msg);
        closeModal();
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      setuploading([false, ""]);
      toast.error("Error uploading the assets to Firebase, Try again!");
      closeModal();
    }
  };

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
      padding: "30",
      //   width: "90%",
      // overflow: "scroll",
      //   height: "90%",
    },
    overlay: {
      zIndex: 500,
      backgroundColor: "rgba(0,0,0,0.6)",
    },
  };

  const [modalIsOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        // onRequestClose={closeModal}
        style={customStyles}
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
      <div className="container min-h-full bg-dashboard text-white mx-auto p-6 duration-300">
        <h1 className="text-2xl font-bold mb-4 text-center">Add Room</h1>
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
                onChange={handleChange}
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

                <option value="c1">C1</option>
                <option value="c2">C2</option>
                <option value="c3">C3</option>
                <option value="c4">C4</option>
                <option value="c5">C5</option>

                <option value="d1">D1</option>
                <option value="d2">D2</option>
                <option value="d3">D3</option>
                <option value="d4">D4</option>
                <option value="d5">D5</option>
              </select>
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
              <input
                placeholder="Building Name"
                type="text"
                className="px-4 py-1.5 rounded-md font-medium text-gray-500 outline-none"
                required
                onChange={handleChange}
                value={roomData.buildingName}
                name="buildingName"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="block text-slate-100 font-semibold">
                Block
              </label>
              <select
                className="px-4 py-1.5 rounded-md font-medium text-gray-500 outline-none"
                required
                onChange={handleChange}
                value={roomData.block}
                name="block"
                id=""
              >
                <option value="">Select Block</option>
                <option value="a">A</option>
                <option value="b">B</option>
                <option value="c">C</option>
                <option value="d">D</option>
              </select>
            </div>
            <div className="flex flex-col items-center gap-2 p-4">
              <label className="block text-slate-100 text-lg font-semibold">
                Video
              </label>
              {roomData.video && (
                <video
                  src={URL.createObjectURL(roomData.video)}
                  title={`Room ${roomData.name} Video`}
                  className="aspect-auto rounded-md"
                  height={50}
                  width={200}
                  controls
                ></video>
              )}
              <label htmlFor="video">
                {roomData.video ? (
                  <FaPencil className="border-2 rounded-full p-1 text-3xl border-dashboard text-slate-100 cursor-pointer" />
                ) : (
                  <FaPlus className="border-2 rounded-full p-1 text-3xl border-dashboard text-slate-100 cursor-pointer" />
                )}
              </label>
              <input
                hidden
                type="file"
                name="video"
                id="video"
                accept="video/*"
                onChange={(e) => {
                  setError("");
                  setRoomData((prevData) => ({
                    ...prevData,
                    video: e.target.files[0],
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

          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded-md mx-auto block mt-6"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default ManagerAddARoom;
