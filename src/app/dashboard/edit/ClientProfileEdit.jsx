"use client";
import PreLoader from "@/Components/PreLoader/PreLoader";
import { AuthContext } from "@/providers/ContextProvider";
import { convertCamelCaseToCapitalized } from "@/utils/camelToCapitalize";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { FaPlus, FaTimes, FaUserEdit } from "react-icons/fa";
import { ImBlocked } from "react-icons/im";
import { IoSaveOutline } from "react-icons/io5";
import { MdReportProblem } from "react-icons/md";
import Swal from "sweetalert2";

const ClientProfileEdit = ({ user: preUser }) => {
  const router = useRouter();
  const { userRefetch } = useContext(AuthContext);

  const [user, setUser] = useState(preUser || {});

  useEffect(() => {
    setUser((prev) => ({ ...prev, ...preUser }));
  }, [preUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const floors = [
    { value: 0, label: "Ground Floor" },
    { value: 1, label: "First Floor" },
    { value: 2, label: "Second Floor" },
    { value: 3, label: "Third Floor" },
    { value: 4, label: "Fourth Floor" },
    { value: 5, label: "Fifth Floor" },
    { value: 6, label: "Sixth Floor" },
    { value: 7, label: "Seventh Floor" },
    { value: 8, label: "Eighth Floor" },
    { value: 9, label: "Ninth Floor" },
    { value: 10, label: "Tenth Floor" },
    { value: 11, label: "Eleventh Floor" },
    { value: 12, label: "Twelfth Floor" },
  ];

  const handleSave = async () => {
    try {
      if (!user?.username) throw new Error("UserName is Required!");
      if (!user?.email) throw new Error("Email is Required!");
      if (!user?.studentId) throw new Error("Student ID is Required!");
      if (!user?.bloodGroup) throw new Error("Blood Group is Required!");
      if (!user?.contactNumber) throw new Error("Contact Number is Required!");
      if (!user?.bkashNumber) throw new Error("bKash Number is Required!");
      if (!user?.institution) throw new Error("Institution is Required!");
      if (!user?.profilePicture)
        throw new Error("Profile Picture is Required!");
      if (!user?.role) throw new Error("Role is Required!");
      // if (!user?.idPicture) throw new Error("ID Picture is Required!");
      if (user?.nidAuth) {
        if (!user?.nidFrontPicture || !user?.nidBackPicture)
          throw new Error("NID is Required!");
      } else if (!user?.nidAuth && !user?.birthCertificatePicture)
        throw new Error("Birth Certificate is Required!");

      const formData = new FormData();
      Object.entries(user).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (
          typeof value === "object" &&
          !Array.isArray(value) &&
          value !== null
        ) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });
      const { data } = await axios.patch(
        `/api/user?_id=${user?._id}`,
        formData
      );
      if (!data.success) throw new Error(data.msg);
      toast.success(data.msg);
      await userRefetch();
      router.back();
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg || error.message);
    }
  };

  if (!preUser) return <PreLoader />;

  return (
    <div className="px-5 pb-5 pt-5 bg-dashboard text-white min-h-screen flex flex-col items-center">
      <p className="text-xl text-center mb-5">Edit User</p>
      {/* User Profile Section */}
      <div className="bg-gray-800 shadow-lg rounded-xl p-6 w-full max-w-4xl">
        <div className="flex items-center gap-4">
          {user?.profilePicture ? (
            <div className="flex flex-col items-center">
              <Image
                src={
                  user?.profilePicture instanceof File
                    ? URL.createObjectURL(user?.profilePicture)
                    : user?.profilePicture
                }
                alt="Profile Picture"
                width={100}
                height={100}
                className="rounded-full border border-gray-600 object-cover aspect-square"
              />
              <button
                onClick={() =>
                  handleChange({
                    target: { name: "profilePicture", value: "" },
                  })
                }
                className="duration-300 active:scale-90 px-4 py-1 rounded text-white bg-dashboard text-sm mt-2"
              >
                Change
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <label
                htmlFor="profilePicture"
                className="w-[100px] h-[100px] px-2 py-0.5 border border-dashed rounded-full flex items-center justify-center cursor-pointer"
              >
                <FaPlus />
              </label>
              <input
                onChange={(e) =>
                  handleChange({
                    target: {
                      name: "profilePicture",
                      value: e.target.files[0],
                    },
                  })
                }
                type="file"
                id="profilePicture"
                className="hidden"
              />
              {!user?.profilePicture ? (
                <button
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "profilePicture",
                        value: preUser?.profilePicture,
                      },
                    })
                  }
                  className="duration-300 active:scale-90 px-4 py-1 rounded text-white bg-dashboard text-sm mt-2"
                >
                  Cancel
                </button>
              ) : (
                <button
                  onClick={() =>
                    handleChange({
                      target: { name: "profilePicture", value: "" },
                    })
                  }
                  className="duration-300 active:scale-90 px-4 py-1 rounded text-white bg-dashboard text-sm mt-2"
                >
                  Clear
                </button>
              )}
            </div>
          )}

          <div>
            <input
              type="text"
              name="username"
              className="bg-transparent w-full outline-none"
              value={user?.username || ""}
              onChange={handleChange}
            />
            <input
              type="text"
              name="email"
              className="text-gray-400 bg-transparent w-full outline-none"
              value={user?.email || ""}
              onChange={handleChange}
            />
            <p className="text-sm text-gray-500">
              {convertCamelCaseToCapitalized(user?.role)} -{" "}
              {user?.nidAuth ? "NID" : "Birth Certificate"}
            </p>
          </div>
          <div className="flex-1 flex flex-col items-end justify-center gap-6">
            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-4">
              <div
                onClick={handleSave}
                className="text-2xl aspect-square rounded-full bg-dashboard flex items-center justify-center w-10 h-10 duration-300 active:scale-90 cursor-pointer shadow-white shadow"
              >
                <IoSaveOutline className="" />
              </div>

              <Link href={`/dashboard`}>
                <div className="text-2xl aspect-square rounded-full bg-dashboard flex items-center justify-center w-10 h-10 duration-300 active:scale-90 cursor-pointer shadow-white shadow">
                  <FaTimes className="" />
                </div>
              </Link>
            </div>
            {user?.blockDate && (
              <p className="text-red-500 text-sm">
                {new Date(user?.blockDate).toDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold border-b border-gray-700 pb-2">
            Contact Information
          </h3>
          <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
            <p className="flex items-center justify-start gap-2">
              <span className="font-semibold w-max">Contact:</span>
              <input
                type="text"
                name="contactNumber"
                className="bg-transparent outline-none"
                value={user?.contactNumber || ""}
                onChange={handleChange}
              />
            </p>
            <p className="flex items-center justify-start gap-2">
              <span className="font-semibold w-max">
                Father&apos;s Contact:
              </span>
              <input
                disabled
                type="text"
                name="fathersNumber"
                className="bg-transparent outline-none"
                value={user?.fathersNumber || ""}
              />
            </p>
            <p className="flex items-center justify-start gap-2">
              <span className="font-semibold w-max">
                Mother&apos;s Contact:
              </span>
              <input
                disabled
                type="text"
                name="mothersNumber"
                className="bg-transparent outline-none"
                value={user?.mothersNumber || ""}
              />
            </p>
            <p className="flex items-center justify-start gap-2">
              <span className="font-semibold w-max">Bkash Number:</span>
              <input
                type="text"
                name="bkashNumber"
                className="bg-transparent outline-none"
                value={user?.bkashNumber || ""}
                onChange={handleChange}
              />
            </p>
          </div>
        </div>

        {/* Education & Address */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold border-b border-gray-700 pb-2">
            Education & Address
          </h3>
          <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
            <p className="flex items-center justify-start gap-2">
              <span className="font-semibold w-max">Institution:</span>
              <input
                type="text"
                name="institution"
                className="bg-transparent outline-none w-full"
                value={user?.institution || ""}
                onChange={handleChange}
              />
            </p>
            <p className="flex items-center justify-start gap-2">
              <span className="font-semibold w-max">Inst. ID:</span>
              <input
                type="text"
                name="studentId"
                className="bg-transparent outline-none"
                value={user?.studentId || ""}
                onChange={handleChange}
              />
            </p>
            <p className="flex items-center justify-start gap-2">
              <span className="font-semibold w-max">Blood Group:</span>
              <input
                type="text"
                name="bloodGroup"
                className="bg-transparent outline-none"
                value={user?.bloodGroup || ""}
                onChange={handleChange}
              />
            </p>
            <p>
              <span className="font-semibold">Room:</span>{" "}
              {convertCamelCaseToCapitalized(user?.roomNumber)}
            </p>
            <p>
              <span className="font-semibold">Floor:</span>{" "}
              {floors.find((f) => f.value == user?.floor)?.label}
            </p>
            <p className="flex items-center justify-start gap-2">
              <span className="font-semibold w-max">Mess Address:</span>
              <input
                disabled
                type="text"
                name="messAddress"
                className="bg-transparent outline-none"
                value={user?.messAddress || ""}
              />
            </p>
          </div>
        </div>

        {/* Charges Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold border-b border-gray-700 pb-2">
            Charges
          </h3>
          {preUser?.charges && preUser.charges.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {preUser.charges.map((charge, index) => (
                <li
                  key={index}
                  className="py-2 flex items-center justify-center gap-4"
                >
                  <span className="text-gray-400 font-semibold">
                    {charge.note}
                  </span>
                  <span className="font-semibold">{charge.amount} BDT</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No charges available</p>
          )}
        </div>

        {/* Document Images */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold border-b border-gray-700 pb-2">
            Documents
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
            {/* idPicture */}
            {user?.idPicture ? (
              <div className="flex flex-col items-center">
                <p className="text-sm text-gray-400 mb-1">ID Picture</p>
                <Image
                  src={
                    user?.idPicture instanceof File
                      ? URL.createObjectURL(user?.idPicture)
                      : user?.idPicture
                  }
                  alt="ID Picture"
                  width={120}
                  height={120}
                  className="rounded-md border border-gray-600"
                />
                {user?.idPicture instanceof File && (
                  <button
                    onClick={() =>
                      handleChange({ target: { name: "idPicture", value: "" } })
                    }
                    className="duration-300 active:scale-90 px-4 py-1 rounded text-white bg-dashboard text-sm mt-2"
                  >
                    Change
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <p className="text-sm text-gray-400 mb-1">ID Picture</p>
                <label
                  htmlFor="idPicture"
                  className="w-[120px] h-[120px] px-2 py-0.5 border border-dashed rounded-md flex items-center justify-center cursor-pointer"
                >
                  <FaPlus />
                </label>
                <input
                  onChange={(e) =>
                    handleChange({
                      target: { name: "idPicture", value: e.target.files[0] },
                    })
                  }
                  type="file"
                  id="idPicture"
                  className="hidden"
                />
                {!user?.idPicture ? (
                  <button
                    onClick={() =>
                      handleChange({
                        target: {
                          name: "idPicture",
                          value: preUser?.idPicture,
                        },
                      })
                    }
                    className="duration-300 active:scale-90 px-4 py-1 rounded text-white bg-dashboard text-sm mt-2"
                  >
                    Cancel
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      handleChange({
                        target: { name: "idPicture", value: "" },
                      })
                    }
                    className="duration-300 active:scale-90 px-4 py-1 rounded text-white bg-dashboard text-sm mt-2"
                  >
                    Clear
                  </button>
                )}
              </div>
            )}
            {/* birthCertificatePicture */}
            {user?.birthCertificatePicture ? (
              <div className="flex flex-col items-center">
                <p className="text-sm text-gray-400 mb-1">Birth Certificate</p>
                <Image
                  src={
                    user?.birthCertificatePicture instanceof File
                      ? URL.createObjectURL(user?.birthCertificatePicture)
                      : user?.birthCertificatePicture
                  }
                  alt="Birth Certificate"
                  width={120}
                  height={120}
                  className="rounded-md border border-gray-600"
                />
                {user?.birthCertificatePicture instanceof File && (
                  <button
                    onClick={() =>
                      handleChange({
                        target: { name: "birthCertificatePicture", value: "" },
                      })
                    }
                    className="duration-300 active:scale-90 px-4 py-1 rounded text-white bg-dashboard text-sm mt-2"
                  >
                    Change
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <p className="text-sm text-gray-400 mb-1">Birth Certificate</p>
                <label
                  htmlFor="birthCertificatePicture"
                  className="w-[120px] h-[120px] px-2 py-0.5 border border-dashed rounded-md flex items-center justify-center cursor-pointer"
                >
                  <FaPlus />
                </label>
                <input
                  onChange={(e) =>
                    handleChange({
                      target: {
                        name: "birthCertificatePicture",
                        value: e.target.files[0],
                      },
                    })
                  }
                  type="file"
                  id="birthCertificatePicture"
                  className="hidden"
                />
                {!user?.birthCertificatePicture ? (
                  <button
                    onClick={() =>
                      handleChange({
                        target: {
                          name: "birthCertificatePicture",
                          value: preUser?.birthCertificatePicture,
                        },
                      })
                    }
                    className="duration-300 active:scale-90 px-4 py-1 rounded text-white bg-dashboard text-sm mt-2"
                  >
                    Cancel
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      handleChange({
                        target: { name: "birthCertificatePicture", value: "" },
                      })
                    }
                    className="duration-300 active:scale-90 px-4 py-1 rounded text-white bg-dashboard text-sm mt-2"
                  >
                    Clear
                  </button>
                )}
              </div>
            )}
            {/* nidFrontPicture */}
            {user?.nidFrontPicture ? (
              <div className="flex flex-col items-center">
                <p className="text-sm text-gray-400 mb-1">NID Front-Side</p>
                <Image
                  src={
                    user?.nidFrontPicture instanceof File
                      ? URL.createObjectURL(user?.nidFrontPicture)
                      : user?.nidFrontPicture
                  }
                  alt="NID Front-Side"
                  width={120}
                  height={120}
                  className="rounded-md border border-gray-600"
                />
                {user?.nidFrontPicture instanceof File && (
                  <button
                    onClick={() =>
                      handleChange({
                        target: { name: "nidFrontPicture", value: "" },
                      })
                    }
                    className="duration-300 active:scale-90 px-4 py-1 rounded text-white bg-dashboard text-sm mt-2"
                  >
                    Change
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <p className="text-sm text-gray-400 mb-1">NID Front-Side</p>
                <label
                  htmlFor="nidFrontPicture"
                  className="w-[120px] h-[120px] px-2 py-0.5 border border-dashed rounded-md flex items-center justify-center cursor-pointer"
                >
                  <FaPlus />
                </label>
                <input
                  onChange={(e) =>
                    handleChange({
                      target: {
                        name: "nidFrontPicture",
                        value: e.target.files[0],
                      },
                    })
                  }
                  type="file"
                  id="nidFrontPicture"
                  className="hidden"
                />
                {!user?.nidFrontPicture ? (
                  <button
                    onClick={() =>
                      handleChange({
                        target: {
                          name: "nidFrontPicture",
                          value: preUser?.nidFrontPicture,
                        },
                      })
                    }
                    className="duration-300 active:scale-90 px-4 py-1 rounded text-white bg-dashboard text-sm mt-2"
                  >
                    Cancel
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      handleChange({
                        target: { name: "nidFrontPicture", value: "" },
                      })
                    }
                    className="duration-300 active:scale-90 px-4 py-1 rounded text-white bg-dashboard text-sm mt-2"
                  >
                    Clear
                  </button>
                )}
              </div>
            )}
            {/* nidBackPicture */}
            {user?.nidBackPicture ? (
              <div className="flex flex-col items-center">
                <p className="text-sm text-gray-400 mb-1">NID Back-Side</p>
                <Image
                  src={
                    user?.nidBackPicture instanceof File
                      ? URL.createObjectURL(user?.nidBackPicture)
                      : user?.nidBackPicture
                  }
                  alt="NID Back-Side"
                  width={120}
                  height={120}
                  className="rounded-md border border-gray-600"
                />
                {user?.nidBackPicture instanceof File && (
                  <button
                    onClick={() =>
                      handleChange({
                        target: { name: "nidBackPicture", value: "" },
                      })
                    }
                    className="duration-300 active:scale-90 px-4 py-1 rounded text-white bg-dashboard text-sm mt-2"
                  >
                    Change
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <p className="text-sm text-gray-400 mb-1">NID Back-Side</p>
                <label
                  htmlFor="nidBackPicture"
                  className="w-[120px] h-[120px] px-2 py-0.5 border border-dashed rounded-md flex items-center justify-center cursor-pointer"
                >
                  <FaPlus />
                </label>
                <input
                  onChange={(e) =>
                    handleChange({
                      target: {
                        name: "nidBackPicture",
                        value: e.target.files[0],
                      },
                    })
                  }
                  type="file"
                  id="nidBackPicture"
                  className="hidden"
                />
                {!user?.nidBackPicture ? (
                  <button
                    onClick={() =>
                      handleChange({
                        target: {
                          name: "nidBackPicture",
                          value: preUser?.nidBackPicture,
                        },
                      })
                    }
                    className="duration-300 active:scale-90 px-4 py-1 rounded text-white bg-dashboard text-sm mt-2"
                  >
                    Cancel
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      handleChange({
                        target: { name: "nidBackPicture", value: "" },
                      })
                    }
                    className="duration-300 active:scale-90 px-4 py-1 rounded text-white bg-dashboard text-sm mt-2"
                  >
                    Clear
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfileEdit;
