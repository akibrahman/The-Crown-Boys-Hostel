"use client";
import { AuthContext } from "@/providers/ContextProvider";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { FaPlus } from "react-icons/fa";
import Modal from "react-modal";

const AddBuinding = ({ refetch }) => {
  const { user } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    managerId: user?._id,
    name: "",
    location: "",
    floorsCount: "",
    sqFt: 0,
    adding: false,
    buildingImage: null,
  });
  useEffect(() => {
    setFormData({ ...formData, managerId: user?._id });
  }, [user]);
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
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      managerId: user?._id,
      name: "",
      location: "",
      floorsCount: "",
      sqFt: 0,
      adding: false,
      buildingImage: null,
    });
  };
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!formData.managerId)
        return toast.error("Something went wrong, try again!");
      setFormData({ ...formData, adding: true });
      const dataToSend = new FormData();
      dataToSend.append("name", formData.name);
      dataToSend.append("location", formData.location);
      dataToSend.append("floorsCount", formData.floorsCount);
      dataToSend.append("sqFt", formData.sqFt);
      dataToSend.append("buildingImage", formData.buildingImage);
      const { data } = await axios.post("/api/building", dataToSend);
      if (!data.success) throw new Error(data.msg);
      else {
        await refetch();
        toast.success(data.msg);
        closeModal();
      }
    } catch (error) {
      setFormData({ ...formData, adding: false });
      console.log(error);
      toast.error(error?.response?.data?.msg || error?.message);
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
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            <input
              type="file"
              name="buildingImage"
              placeholder="Upload Building Image"
              onChange={(e) =>
                setFormData({ ...formData, buildingImage: e?.target?.files[0] })
              }
              className="border p-2 rounded"
              required
            />
            <button
              type="submit"
              className="bg-dashboard text-white px-4 py-2 rounded font-semibold flex items-center justify-center gap-4"
            >
              Submit{" "}
              {formData.adding && (
                <CgSpinner className="animate-spin text-xl" />
              )}
            </button>
          </form>
        </div>
      </Modal>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center absolute top-5 right-5 gap-2 font-semibold text-white bg-blue-500 px-4 py-1 rounded-md active:scale-90 duration-300"
      >
        Add <FaPlus className="text-l" />
      </button>
    </>
  );
};

export default AddBuinding;
