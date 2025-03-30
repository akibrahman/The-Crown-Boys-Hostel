"use client";
import PreLoader from "@/Components/PreLoader/PreLoader";
import { convertCamelCaseToCapitalized } from "@/utils/camelToCapitalize";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { FaPlus, FaTimes, FaUserEdit } from "react-icons/fa";
import { ImBlocked } from "react-icons/im";
import { IoSaveOutline } from "react-icons/io5";
import { MdReportProblem } from "react-icons/md";
import Swal from "sweetalert2";

const UserDetailsEdit = () => {
  const paramsData = useParams();
  const router = useRouter();
  const email = decodeURIComponent(paramsData.email);

  const [user, setUser] = useState({});

  const {
    data: userDB,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["userDetails", email],
    queryFn: async ({ queryKey }) => {
      try {
        const { data } = await axios.get(`/api/user?email=${queryKey[1]}`);
        if (data?.user) return data.user;
        return null;
      } catch (error) {
        return null;
      }
    },
  });

  useEffect(() => {
    setUser((prev) => ({ ...prev, ...userDB }));
  }, [userDB]);

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

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/dashboard/clients");
    }
  }, [isLoading, user, router]);

  const handleSave = async () => {
    try {
      console.log("User Data : ", user);
      console.log("User Data : ", user.nidAuth);
      // await axios.put(`/api/user/${user.email}`, user);
      // toast.success("User updated successfully");
      // refetch();
    } catch (error) {
      toast.error("Failed to update user");
    }
  };

  if (isLoading) return <PreLoader />;

  return (
    <div className="px-5 pb-5 pt-5 bg-dashboard text-white min-h-screen flex flex-col items-center">
      <p className="text-xl text-center mb-5">Edit User</p>
      {/* User Profile Section */}
      <div className="bg-gray-800 shadow-lg rounded-xl p-6 w-full max-w-4xl">
        <div className="flex items-start gap-4">
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
                        value: userDB?.profilePicture,
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
            <select
              name="nidAuth"
              value={user?.nidAuth}
              onChange={(e) =>
                setUser((prev) => ({
                  ...prev,
                  nidAuth: e.target.value == "true" ? true : false,
                }))
              }
              className="bg-gray-700 rounded-md text-white w-min outline-none cursor-pointer mt-1"
            >
              <option value={true}>NID</option>
              <option value={false}>Birth Certificate</option>
            </select>
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

              <Link href={`/dashboard/clients`}>
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
                type="text"
                name="fathersNumber"
                className="bg-transparent outline-none"
                value={user?.fathersNumber || ""}
                onChange={handleChange}
              />
            </p>
            <p className="flex items-center justify-start gap-2">
              <span className="font-semibold w-max">
                Mother&apos;s Contact:
              </span>
              <input
                type="text"
                name="mothersNumber"
                className="bg-transparent outline-none"
                value={user?.mothersNumber || ""}
                onChange={handleChange}
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
                type="text"
                name="messAddress"
                className="bg-transparent outline-none"
                value={user?.messAddress || ""}
                onChange={handleChange}
              />
            </p>
          </div>
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
                <button
                  onClick={() =>
                    handleChange({ target: { name: "idPicture", value: "" } })
                  }
                  className="duration-300 active:scale-90 px-4 py-1 rounded text-white bg-dashboard text-sm mt-2"
                >
                  Change
                </button>
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
                        target: { name: "idPicture", value: userDB?.idPicture },
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
                          value: userDB?.birthCertificatePicture,
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
                          value: userDB?.nidFrontPicture,
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
                          value: userDB?.nidBackPicture,
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

export default UserDetailsEdit;
