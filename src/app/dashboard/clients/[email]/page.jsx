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
import { FaUserEdit } from "react-icons/fa";
import { ImBlocked } from "react-icons/im";
import { MdReportProblem } from "react-icons/md";
import Swal from "sweetalert2";

const UserDetails = () => {
  const paramsData = useParams();
  const router = useRouter();
  const email = decodeURIComponent(paramsData.email);
  const [givingAuthorization, setGivingAuthorization] = useState(false);
  const [declining, setDeclining] = useState(false);
  const [currentDays, setCurrentDays] = useState(null);

  const {
    data: user,
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
    if (
      user?.role === "client" ||
      user?.role === "manager" ||
      user?.role === "owner"
    ) {
      const currentDate = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Dhaka",
      });
      let currentMonth = new Date(currentDate).getMonth() + 1;
      let currentYear = new Date(currentDate).getFullYear();
      if (currentMonth >= 12 || currentMonth == "12") {
        console.log("True");
        currentMonth = 0;
        currentYear++;
      }
      const dayCountOfCurrentMonth = parseInt(
        new Date(currentYear, currentMonth, 0).getDate()
      );

      let tempArray = [];
      for (let i = 1; i <= dayCountOfCurrentMonth; i++) {
        tempArray.push(i);
      }
      setCurrentDays(tempArray);
    }
  }, [user?.role]);

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

  if (isLoading) return <PreLoader />;

  return (
    <div className="px-5 py-10 bg-dashboard text-white min-h-screen flex flex-col items-center">
      {/* User Profile Section */}
      <div className="bg-gray-800 shadow-lg rounded-xl p-6 w-full max-w-4xl">
        <div className="flex items-center gap-4">
          <Image
            src={user?.profilePicture || "/default-profile.png"}
            alt="Profile Picture"
            width={100}
            height={100}
            className="rounded-full border border-gray-600 object-cover aspect-square"
          />
          <div>
            <h2 className="text-2xl font-bold">{user?.username}</h2>
            <p className="text-gray-400">{user?.email}</p>
            <p className="text-sm text-gray-500">
              {convertCamelCaseToCapitalized(user?.role)} -{" "}
              {user?.nidAuth ? "NID" : "Birth Certificate"}
            </p>
          </div>
          <div className="flex-1 flex flex-col items-end justify-center gap-6">
            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-4">
              <Link href={`/dashboard/clients/${user.email}/edit`}>
                <div className="text-2xl aspect-square rounded-full bg-dashboard flex items-center justify-center w-10 h-10 duration-300 active:scale-90 cursor-pointer shadow-white shadow">
                  <FaUserEdit className="" />
                </div>
              </Link>

              {!user?.blockDate && (
                <div className="text-xl aspect-square rounded-full bg-dashboard flex items-center justify-center w-10 h-10 duration-300 active:scale-90 cursor-pointer shadow-white shadow">
                  <ImBlocked className="" />
                </div>
              )}
              {user?.blockDate && (
                <div className="text-xl text-red-500 aspect-square rounded-full bg-dashboard flex items-center justify-center w-10 h-10 duration-300 active:scale-90 cursor-pointer shadow-red-500 shadow">
                  <ImBlocked className="" />
                </div>
              )}

              <div className="text-2xl aspect-square rounded-full bg-dashboard flex items-center justify-center w-10 h-10 duration-300 active:scale-90 cursor-pointer shadow-white shadow">
                <MdReportProblem className="" />
              </div>
            </div>
            {user?.blockDate && (
              <p className="text-red-500 text-sm">
                {new Date(user?.blockDate).toDateString()}
              </p>
            )}
            {/* Approve Rejecvt Buttons */}
            {user?.isVerified && user?.isClient && !user?.isClientVerified && (
              <div className="flex items-center justify-center gap-4 select-none">
                <button
                  onClick={async () => {
                    const swalRes = await Swal.fire({
                      title: `Do you want to Decline ${user?.username}?`,
                      icon: "question",
                      showCancelButton: true,
                      confirmButtonColor: "#1493EA",
                      cancelButtonColor: "#EF4444",
                      confirmButtonText: "Proceed",
                      cancelButtonText: "Cancel",
                      background: "#141E30",
                      color: "#fff",
                    });
                    if (!swalRes.isConfirmed) {
                      return toast.success("Cancelled!");
                    }
                    setDeclining(true);
                    try {
                      const { data } = await axios.post(
                        "/api/clients/declineclient",
                        { id: user?._id }
                      );
                      if (!data.success) throw new Error(data.msg);
                      toast.success("Client Declined Successfully");
                      router.push("/dashboard/clients");
                    } catch (error) {
                      console.log(error);
                      toast.error(error?.response?.data?.msg || error.message);
                    } finally {
                      setDeclining(false);
                    }
                  }}
                  className="bg-red-500 text-white font-semibold px-4 py-1 rounded-full duration-300 flex items-center gap-1 active:scale-90"
                >
                  Decline
                  {declining && <CgSpinner className="animate-spin text-2xl" />}
                </button>
                <button
                  onClick={async () => {
                    const swalRes = await Swal.fire({
                      title: `Do you want to Accept ${user?.username}?`,
                      icon: "question",
                      showCancelButton: true,
                      confirmButtonColor: "#1493EA",
                      cancelButtonColor: "#EF4444",
                      confirmButtonText: "Proceed",
                      cancelButtonText: "Cancel",
                      background: "#141E30",
                      color: "#fff",
                    });
                    if (!swalRes.isConfirmed) {
                      return toast.success("Cancelled!");
                    }
                    setGivingAuthorization(true);
                    try {
                      const userId = user?._id;
                      const days = parseInt(
                        currentDays[currentDays.length - 1]
                      );
                      const currentMonthName = new Date().toLocaleDateString(
                        "en-BD",
                        {
                          month: "long",
                          timeZone: "Asia/Dhaka",
                        }
                      );
                      const currentDateNumber = parseInt(
                        new Date().toLocaleDateString("en-BD", {
                          day: "numeric",
                          timeZone: "Asia/Dhaka",
                        })
                      );
                      const currentMonth = new Date(
                        new Date().toLocaleString("en-US", {
                          timeZone: "Asia/Dhaka",
                        })
                      ).getMonth();
                      const currentYear = new Date(
                        new Date().toLocaleString("en-US", {
                          timeZone: "Asia/Dhaka",
                        })
                      ).getFullYear();

                      const payLoad = {
                        userId,
                        days,
                        currentMonthName,
                        currentDateNumber,
                        currentMonth,
                        currentYear,
                      };

                      if (
                        userId == null ||
                        days == null ||
                        currentMonthName == null ||
                        currentDateNumber == null ||
                        currentMonth == null ||
                        currentYear == null
                      ) {
                        return toast.error("Missing Data!");
                      }

                      const { data } = await axios.post(
                        "/api/clients/approveclient",
                        payLoad
                      );
                      if (data.success) {
                        toast.success("Authorization Provided");
                      } else throw new Error(data.msg);
                    } catch (error) {
                      console.log(error);
                      toast.error(error?.response?.data?.msg || error?.message);
                    } finally {
                      await refetch();
                      setGivingAuthorization(false);
                    }
                  }}
                  className="bg-green-500 text-white font-semibold px-4 py-1 rounded-full duration-300 flex items-center gap-1 active:scale-90"
                >
                  Approve
                  {givingAuthorization && (
                    <CgSpinner className="animate-spin text-2xl" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold border-b border-gray-700 pb-2">
            Contact Information
          </h3>
          <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
            <p>
              <span className="font-semibold">Contact:</span>{" "}
              {user?.contactNumber}
            </p>
            <p>
              <span className="font-semibold">Father&apos;s Contact:</span>{" "}
              {user?.fathersNumber}
            </p>
            <p>
              <span className="font-semibold">Mother&apos;s Contact:</span>{" "}
              {user?.mothersNumber}
            </p>
            <p>
              <span className="font-semibold">Bkash Number:</span>{" "}
              {user?.bkashNumber}
            </p>
          </div>
        </div>

        {/* Education & Address */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold border-b border-gray-700 pb-2">
            Education & Address
          </h3>
          <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
            <p>
              <span className="font-semibold">Institution:</span>{" "}
              {user?.institution}
            </p>
            <p>
              <span className="font-semibold">Inst. ID:</span> {user?.studentId}
            </p>
            <p>
              <span className="font-semibold">Blood Group:</span>{" "}
              {user?.bloodGroup}
            </p>
            <p>
              <span className="font-semibold">Room:</span>{" "}
              {convertCamelCaseToCapitalized(user?.roomNumber)}
            </p>
            <p>
              <span className="font-semibold">Floor:</span>{" "}
              {floors.find((f) => f.value == user?.floor)?.label}
            </p>
            <p>
              <span className="font-semibold">Mess Address:</span>{" "}
              {user?.messAddress}
            </p>
          </div>
        </div>

        {/* Document Images */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold border-b border-gray-700 pb-2">
            Documents
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
            {user?.idPicture && (
              <Link target="_blank" href={user?.idPicture}>
                <div className="flex flex-col items-center">
                  <Image
                    src={user?.idPicture}
                    alt="ID Picture"
                    width={120}
                    height={120}
                    className="rounded-md border border-gray-600"
                  />
                  <p className="text-sm text-gray-400 mt-1">ID Picture</p>
                </div>
              </Link>
            )}
            {user?.birthCertificatePicture && (
              <Link target="_blank" href={user?.birthCertificatePicture}>
                <div className="flex flex-col items-center">
                  <Image
                    src={user?.birthCertificatePicture}
                    alt="Birth Certificate"
                    width={120}
                    height={120}
                    className="rounded-md border border-gray-600"
                  />
                  <p className="text-sm text-gray-400 mt-1">
                    Birth Certificate
                  </p>
                </div>{" "}
              </Link>
            )}
            {user?.nidFrontPicture && (
              <Link target="_blank" href={user?.nidFrontPicture}>
                <div className="flex flex-col items-center">
                  <Image
                    src={user?.nidFrontPicture}
                    alt="NID Front"
                    width={120}
                    height={120}
                    className="rounded-md border border-gray-600"
                  />
                  <p className="text-sm text-gray-400 mt-1">NID Front</p>
                </div>{" "}
              </Link>
            )}
            {user?.nidBackPicture && (
              <Link target="_blank" href={user?.nidBackPicture}>
                <div className="flex flex-col items-center">
                  <Image
                    src={user?.nidBackPicture}
                    alt="NID Back"
                    width={120}
                    height={120}
                    className="rounded-md border border-gray-600"
                  />
                  <p className="text-sm text-gray-400 mt-1">NID Back</p>
                </div>{" "}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
