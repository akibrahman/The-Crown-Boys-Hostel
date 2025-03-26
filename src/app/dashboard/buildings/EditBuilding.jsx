"use client";

import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { RiEdit2Fill } from "react-icons/ri";
import Modal from "react-modal";

const EditBuilding = ({ building, user, refetch }) => {
  const [editing, setEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    managerId: user?._id,
    name: building.name,
    location: building.location,
    floorsCount: building.floorsCount,
    sqFt: building.sqFt,
    buildingImage: building.buildingImage,
    isNewImage: false,
    newBuildingImage: null,
  });
  useEffect(() => {
    setFormData({
      managerId: user?._id,
      name: building.name,
      location: building.location,
      floorsCount: building.floorsCount,
      sqFt: building.sqFt,
      buildingImage: building.buildingImage,
    });
  }, [user, building]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
      padding: "0",
      width: "auto",
      // overflow: "scroll",
      height: "auto",
    },
    overlay: {
      zIndex: 500,
      backgroundColor: "rgba(0,0,0,0.5)",
    },
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditing(false);
    setFormData({
      managerId: user?._id,
      name: building.name,
      location: building.location,
      floorsCount: building.floorsCount,
      sqFt: building.sqFt,
      buildingImage: building.buildingImage,
      isNewImage: false,
      newBuildingImage: null,
    });
  };
  const editBuilding = async (e) => {
    e.preventDefault();
    if (!formData.managerId)
      return toast.error("Something went wrong, try again!");
    setEditing(true);
    const dataToSend = new FormData();
    dataToSend.append("_id", building._id);
    dataToSend.append("name", formData.name);
    dataToSend.append("location", formData.location);
    dataToSend.append("floorsCount", formData.floorsCount);
    dataToSend.append("sqFt", formData.sqFt);
    dataToSend.append("isNewImage", formData.isNewImage);
    dataToSend.append("newBuildingImage", formData.newBuildingImage);
    try {
      const { data } = await axios.patch("/api/building", dataToSend);
      if (!data.success) throw new Error(data.msg);
      else {
        await refetch();
        toast.success(data.msg);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg || error?.message);
    } finally {
      closeModal();
    }
  };
  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <div className="p-5 flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4">Add New Building</h2>
          <form onSubmit={editBuilding} className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              placeholder="Building Name"
              value={formData.name}
              onChange={handleChange}
              className="border p-2 rounded md:w-[500px]"
              required
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              name="floorsCount"
              placeholder="G + n"
              value={formData.floorsCount}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              name="sqFt"
              placeholder="Total Square Feet"
              value={formData.sqFt}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            {!formData.isNewImage ? (
              <div className="flex flex-col items-center justify-center gap-4">
                <Image
                  src={formData.buildingImage}
                  alt={formData.name}
                  width="500"
                  height="500"
                  className="w-40 h-48 object-cover aspect-square mx-auto rounded"
                />
                <button
                  type="button"
                  className="bg-dashboard text-white px-4 py-2 rounded font-semibold flex items-center justify-center gap-4 flex-1 duration-300 active:scale-90"
                  onClick={() => setFormData({ ...formData, isNewImage: true })}
                >
                  Change
                </button>
              </div>
            ) : formData.newBuildingImage ? (
              <div className="flex flex-col items-center justify-center gap-4">
                <Image
                  src={URL.createObjectURL(formData.newBuildingImage)}
                  alt={formData.name}
                  width="500"
                  height="500"
                  className="w-40 h-48 object-cover aspect-square mx-auto rounded"
                />
                <button
                  type="button"
                  className="bg-dashboard text-white px-4 py-2 rounded font-semibold flex items-center justify-center gap-4 flex-1 duration-300 active:scale-90"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      isNewImage: false,
                      newBuildingImage: null,
                    })
                  }
                >
                  Clear
                </button>
              </div>
            ) : (
              <input
                type="file"
                name="buildingImage"
                placeholder="Upload Building Image"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    newBuildingImage: e?.target?.files[0],
                  })
                }
                className="border p-2 rounded"
                required
              />
            )}

            <div className="flex items-center gap-4">
              <button
                type="submit"
                className="bg-dashboard text-white px-4 py-2 rounded font-semibold flex items-center justify-center gap-4 flex-1 duration-300 active:scale-90"
              >
                Submit
                {formData.adding && (
                  <CgSpinner className="animate-spin text-xl" />
                )}
              </button>
              <button
                type="button"
                className="bg-dashboard text-white px-4 py-2 rounded font-semibold flex items-center justify-center gap-4 flex-1 duration-300 active:scale-90"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Modal>
      {editing ? (
        <CgSpinner className="text-3xl text-orange-500 bg-orange-200 animate-spin p-1.5 rounded-full cursor-wait" />
      ) : (
        <RiEdit2Fill
          onClick={() => setIsModalOpen(true)}
          className="text-3xl text-orange-500 bg-orange-200 p-1 rounded-full duration-300 active:scale-90 cursor-pointer"
        />
      )}
    </>
  );
};

export default EditBuilding;
