"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPencil } from "react-icons/fa6";
import Modal from "react-modal";
import { storage } from "../../../../firebase.config";

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

  const [uploading, setuploading] = useState([false, ""]);
  const [progress, setProgress] = useState(0);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(roomData);
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
    try {
      // Room Image
      let roomImageUpload = Promise.resolve(null);
      if (roomData.image.file) {
        const roomImagePath = `rooms/${roomData.floor}/${roomData.name}/image/${roomData.name}.jpg`;
        roomImageUpload = uploadFile(roomData.image.file, roomImagePath);
      }
      // Room Video
      let roomVideoUpload = Promise.resolve(null);
      if (roomData.video.file) {
        const roomVideoPath = `rooms/${roomData.floor}/${roomData.name}/video/${roomData.name}.mp4`;
        roomVideoUpload = uploadFile(roomData.video.file, roomVideoPath);
      }

      // Room Sketch
      let roomSketchUpload = Promise.resolve(null);
      if (roomData.sketch.file) {
        const roomSketchPath = `rooms/${roomData.floor}/${roomData.name}/sketch/${roomData.name}-sketch.jpg`;
        roomSketchUpload = uploadFile(roomData.sketch.file, roomSketchPath);
      }

      // Room Toilet Image
      let roomToiletImageUpload = Promise.resolve(null);
      if (roomData.toilet.image.file) {
        const roomToiletImagePath = `rooms/${roomData.floor}/${roomData.name}/image/${roomData.name}-toilet.jpg`;
        roomToiletImageUpload = uploadFile(
          roomData.toilet.image.file,
          roomToiletImagePath
        );
      }

      // Room Balcony Image
      let roomBalconyImageUpload = Promise.resolve(null);
      if (roomData.balcony.balconyState && roomData.balcony.image.file) {
        const roomBalconyImagePath = `rooms/${roomData.floor}/${roomData.name}/image/${roomData.name}-balcony.jpg`;
        roomBalconyImageUpload = uploadFile(
          roomData.balcony.image.file,
          roomBalconyImagePath
        );
      }

      // Room Beds Image
      const roomBedsImageUploads = roomData.beds.map((bed, i) => {
        if (bed.image.file) {
          const roomBedsImagePath = `rooms/${roomData.floor}/${roomData.name}/image/${roomData.name}-${bed.bedNo}.jpg`;
          return uploadFile(bed.image.file, roomBedsImagePath);
        } else {
          return { src: bed.image.src, path: bed.image.path };
        }
      });
      const [...roomBedsImageData] = await Promise.all([
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
          setuploading([false, ""]);
          setRoomData({});
          closeModal();
          toast.success(data.msg);
        }
      } catch (error) {
        console.error("Server error", error);
        setuploading([false, ""]);
        toast.error(error.response.data.msg);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
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
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
    >
      <div className="mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Update Room</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-6"
        >
          {/* Room Information Fields */}
          <div className="mb-4">
            <label className="block text-gray-700">Room Name</label>
            <select
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
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Video</label>
            <video
              src={roomData.video.src}
              title={`Room ${roomData.name} Video`}
              className="aspect-auto"
              height={50}
              width={200}
              controls
            ></video>
            <label htmlFor="video">
              <FaPencil className="text-2xl text-dashboard cursor-pointer" />
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
          <div className="mb-4">
            <label className="block text-gray-700">Type</label>
            <select
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
          <div className="mb-4">
            <label className="block text-gray-700">Room Sketch</label>
            <Image
              src={roomData.sketch.src}
              alt={`Room ${roomData.name} Sketch`}
              className="aspect-square rounded-md"
              width={200}
              height={200}
            />
            <label htmlFor="sketch">
              <FaPencil className="text-2xl text-dashboard cursor-pointer" />
            </label>
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
          <div className="mb-4">
            <label className="block text-gray-700">Floor</label>
            <select
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
          <div className="mb-4">
            <label className="block text-gray-700">Room Image</label>
            <Image
              src={roomData.image.src}
              alt={`Room ${roomData.name}`}
              className="aspect-square rounded-md"
              width={200}
              height={200}
            />
            <label htmlFor="image">
              <FaPencil className="text-2xl text-dashboard cursor-pointer" />
            </label>
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
          <div className="mb-4">
            <label className="block text-gray-700">Toilet Type</label>
            <select
              onChange={(e) =>
                setRoomData((prevData) => ({
                  ...prevData,
                  toilet: { ...prevData.toilet, toiletType: e.target.value },
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
          <div className="mb-4">
            <label className="block text-gray-700">Toilet Image</label>
            <Image
              src={roomData.toilet.image.src}
              alt={`Room ${roomData.name} Toilet`}
              className="aspect-square rounded-md"
              width={200}
              height={200}
            />
            <label htmlFor="toilet.image">
              <FaPencil className="text-2xl text-dashboard cursor-pointer" />
            </label>
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
          <div className="mb-4">
            <label className="block text-gray-700">Balcony State</label>
            <input
              type="checkbox"
              name="balcony.state"
              checked={roomData.balcony.balconyState}
              onChange={(e) =>
                setRoomData((prevData) => ({
                  ...prevData,
                  balcony: {
                    ...prevData.balcony,
                    balconyState: e.target.checked,
                  },
                }))
              }
              className="mt-1 p-2"
            />
          </div>
          {roomData.balcony.balconyState && (
            <div className="mb-4">
              <label className="block text-gray-700">Balcony Image</label>
              <Image
                src={roomData.balcony.image.src}
                alt={`Room ${roomData.name} Balcony`}
                className="aspect-square rounded-md"
                width={200}
                height={200}
              />
              <label htmlFor="balcony.image">
                <FaPencil className="text-2xl text-dashboard cursor-pointer" />
              </label>
              <input
                type="file"
                name="balcony.image"
                id="balcony.image"
                hidden
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
          <div className="mb-4">
            <h3 className="text-lg font-medium">Beds</h3>
            {roomData.beds.map((bed, index) => (
              <div
                key={index}
                className="bg-gray-100 p-4 rounded-lg shadow-sm mb-4"
              >
                <label className="block text-gray-700">Bed No</label>
                <input
                  required
                  type="text"
                  name="bedNo"
                  value={bed.bedNo}
                  onChange={(e) => handleBedChange(index, e)}
                  className="mt-1 p-2 w-full border rounded-md"
                />
                <label className="block text-gray-700">User Rent</label>
                <input
                  required
                  type="number"
                  name="userRent"
                  value={bed.userRent}
                  onChange={(e) => handleBedChange(index, e)}
                  className="mt-1 p-2 w-full border rounded-md"
                />
                <label className="block text-gray-700">Display Rent</label>
                <input
                  required
                  type="number"
                  name="displayRent"
                  value={bed.displayRent}
                  onChange={(e) => handleBedChange(index, e)}
                  className="mt-1 p-2 w-full border rounded-md"
                />
                <label className="block text-gray-700">Booking Charge</label>
                <input
                  required
                  type="number"
                  name="bookingCharge"
                  value={bed.bookingCharge}
                  onChange={(e) => handleBedChange(index, e)}
                  className="mt-1 p-2 w-full border rounded-md"
                />
                <label className="block text-gray-700">Bed Image</label>
                {bed.image.src && (
                  <Image
                    src={bed.image.src}
                    alt={`Room ${roomData.name} Bed ${bed.bedNo}`}
                    className="aspect-square rounded-md"
                    width={100}
                    height={100}
                  />
                )}
                <label htmlFor={`image-bed-${index}`}>
                  <FaPencil className="text-2xl text-dashboard cursor-pointer" />
                </label>
                <input
                  hidden
                  type="file"
                  name="image"
                  id={`image-bed-${index}`}
                  onChange={(e) => {
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
                <button
                  type="button"
                  onClick={() => removeBed(index)}
                  className="bg-red-500 text-white px-2 py-1 mt-2 rounded-md"
                >
                  Remove Bed
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addBed}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Add Bed
            </button>
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded-md"
          >
            Submit
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default ManagerEditRoomComponent;
