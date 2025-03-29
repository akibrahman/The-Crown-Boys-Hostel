"use client";
import PreLoader from "@/Components/PreLoader/PreLoader";
import { convertCamelCaseToCapitalized } from "@/utils/camelToCapitalize";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

const UserDetails = () => {
  const paramsData = useParams();
  const name = decodeURIComponent(paramsData.name);

  const { data: user, isLoading } = useQuery({
    queryKey: ["userDetails", name],
    queryFn: async ({ queryKey }) => {
      try {
        const { data } = await axios.get(`/api/user?name=${queryKey[1]}`);
        return data.user;
      } catch (error) {
        return null;
      }
    },
  });

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
              <span className="font-semibold">Father's Contact:</span>{" "}
              {user?.fathersNumber}
            </p>
            <p>
              <span className="font-semibold">Mother's Contact:</span>{" "}
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
            {user.idPicture && (
              <Link target="_blank" href={user.idPicture}>
                <div className="flex flex-col items-center">
                  <Image
                    src={user.idPicture}
                    alt="ID Picture"
                    width={120}
                    height={120}
                    className="rounded-md border border-gray-600"
                  />
                  <p className="text-sm text-gray-400 mt-1">ID Picture</p>
                </div>
              </Link>
            )}
            {user.birthCertificatePicture && (
              <div className="flex flex-col items-center">
                <Image
                  src={user.birthCertificatePicture}
                  alt="Birth Certificate"
                  width={120}
                  height={120}
                  className="rounded-md border border-gray-600"
                />
                <p className="text-sm text-gray-400 mt-1">Birth Certificate</p>
              </div>
            )}
            {user.nidFrontPicture && (
              <div className="flex flex-col items-center">
                <Image
                  src={user.nidFrontPicture}
                  alt="NID Front"
                  width={120}
                  height={120}
                  className="rounded-md border border-gray-600"
                />
                <p className="text-sm text-gray-400 mt-1">NID Front</p>
              </div>
            )}
            {user.nidBackPicture && (
              <div className="flex flex-col items-center">
                <Image
                  src={user.nidBackPicture}
                  alt="NID Back"
                  width={120}
                  height={120}
                  className="rounded-md border border-gray-600"
                />
                <p className="text-sm text-gray-400 mt-1">NID Back</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
