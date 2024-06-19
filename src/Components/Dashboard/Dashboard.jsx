"use client";
import { AuthContext } from "@/providers/ContextProvider";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { CgCalendarDates, CgProfile, CgSpinner } from "react-icons/cg";
import { FaFile } from "react-icons/fa";
import { TbCoinTaka } from "react-icons/tb";
import { GrUserManager } from "react-icons/gr";
import ProfileComponent from "./ProfileComponent";
import CurrentMonthComponent from "./CurrentMonthComponent";
import MyBillsComponent from "./MyBillsComponent";
import ManagerDetailsComponent from "./ManagerDetailsComponent";
import FileUpload from "@/app/fileManager/page";
import UserNotVerifiedPage from "./UserNotVerifiedPage";

const Dashboard = ({ user }) => {
  const route = useRouter();
  const searchParams = useSearchParams();
  let displayData = searchParams.get("displayData") || "profile";

  const { userRefetch } = useContext(AuthContext);
  const [profileBarShown, setProfileBarShown] = useState(false);
  // const [displayData, setDisplayData] = useState("profile");

  const [loggingOut, setLoggingOut] = useState(false);
  const logout = async () => {
    setLoggingOut(true);
    try {
      const { data } = await axios.get("/api/users/logout");
      if (data.success) {
        await userRefetch();
        route.push("/signin");
        toast.success(data.msg);
      }
    } catch (error) {
      toast.error("Something went Wrong !");
      console.log(error);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="relative">
      <nav className="w-full border-b bg-gray-800 border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <button
                data-drawer-target="logo-sidebar"
                data-drawer-toggle="logo-sidebar"
                aria-controls="logo-sidebar"
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clip-rule="evenodd"
                    fill-rule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  ></path>
                </svg>
              </button>
              <Link href="https://flowbite.com" className="flex ms-2 md:me-24">
                <Image
                  height={70}
                  width={70}
                  src="/images/logo.png"
                  className=""
                  alt="FlowBite Logo"
                />
                <span className="self-center text-xl font-semib old sm:text-2xl whitespace-nowrap text-white">
                  Dashboard
                </span>
              </Link>
            </div>
            <div className="flex items-center">
              <div className="relative flex items-center ms-3">
                <div>
                  {/* Profile Pic Button  */}
                  <button
                    onClick={() => setProfileBarShown(!profileBarShown)}
                    type="button"
                    className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                    aria-expanded="false"
                  >
                    <span className="sr-only">Open user menu</span>
                    <Image
                      height={50}
                      width={50}
                      className="w-12 h-12 rounded-full"
                      // src={"/images/logo.png"}
                      src={user.profilePicture}
                      alt="user photo"
                    />
                  </button>
                </div>
                {/* Profile pic Drop Bar  */}
                <div
                  className={`z-50 absolute top-full right-0 my-4 text-base list-none divide-y rounded shadow bg-gray-700 divide-gray-600 ${
                    profileBarShown ? "block" : "hidden"
                  }`}
                >
                  <div className="px-4 py-3" role="none">
                    <p
                      className="text-sm text-gray-900 dark:text-white"
                      role="none"
                    >
                      {user.username}
                    </p>
                    <p
                      className="text-sm font-medium text-gray-900 truncate dark:text-gray-300"
                      role="none"
                    >
                      {user.email}
                    </p>
                  </div>
                  <ul className="py-1" role="none">
                    <li>
                      <Link
                        href="#"
                        onClick={logout}
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white flex items-center gap-3"
                        role="menuitem"
                      >
                        Sign out
                        {loggingOut && (
                          <CgSpinner className="animate-spin text-xl" />
                        )}
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-130px)]">
        <aside
          id="logo-sidebar"
          // absolute top-0 left-0 z-40
          className="w-72 h-[calc(100vh-130px)] pt-10 transition-transform -translate-x-full border-r sm:translate-x-0 bg-gray-800 border-gray-700"
          aria-label="Sidebar"
        >
          <div className="h-full px-3 pb-4 overflow-y-auto bg-gray-800">
            <ul className="font-medium flex flex-col gap-2">
              <Link href="/dashboard?displayData=profile">
                <div
                  className={`flex items-center p-2 rounded-lg text-white group select-none cursor-pointer ${
                    displayData == "profile"
                      ? "bg-gray-700"
                      : "hover:bg-gray-700"
                  }`}
                >
                  <CgProfile
                    className={`text-gray-400 text-xl ${
                      displayData == "profile"
                        ? "text-white"
                        : "group-hover:text-white"
                    }`}
                  />
                  <span className="ms-3">Profile</span>
                </div>
              </Link>
              <Link href="/dashboard?displayData=currentMonth">
                <div
                  className={`flex items-center p-2 rounded-lg text-white group select-none cursor-pointer ${
                    displayData == "currentMonth"
                      ? "bg-gray-700"
                      : "hover:bg-gray-700"
                  }`}
                >
                  <CgCalendarDates
                    className={`text-gray-400 text-xl ${
                      displayData == "currentMonth"
                        ? "text-white"
                        : "group-hover:text-white"
                    }`}
                  />
                  <span className="ms-3">Current Month</span>
                </div>
              </Link>
              <Link href="/dashboard?displayData=myBills">
                <div
                  className={`flex items-center p-2 rounded-lg text-white group select-none cursor-pointer ${
                    displayData == "myBills"
                      ? "bg-gray-700"
                      : "hover:bg-gray-700"
                  }`}
                >
                  <TbCoinTaka
                    className={`text-gray-400 text-xl ${
                      displayData == "myBills"
                        ? "text-white"
                        : "group-hover:text-white"
                    }`}
                  />
                  <span className="ms-3">My Bills</span>
                </div>
              </Link>
              <Link href="/dashboard?displayData=managerDetails">
                <div
                  className={`flex items-center p-2 rounded-lg text-white group select-none cursor-pointer ${
                    displayData == "managerDetails"
                      ? "bg-gray-700"
                      : "hover:bg-gray-700"
                  }`}
                >
                  <GrUserManager
                    className={`text-gray-400 text-xl ${
                      displayData == "managerDetails"
                        ? "text-white"
                        : "group-hover:text-white"
                    }`}
                  />
                  <span className="ms-3">Manager Details</span>
                </div>
              </Link>
              <Link href="/dashboard?displayData=fileManager">
                <div
                  className={`flex items-center p-2 rounded-lg text-white group select-none cursor-pointer ${
                    displayData == "fileManager"
                      ? "bg-gray-700"
                      : "hover:bg-gray-700"
                  }`}
                >
                  <FaFile
                    className={`text-gray-400 text-xl ${
                      displayData == "fileManager"
                        ? "text-white"
                        : "group-hover:text-white"
                    }`}
                  />
                  <span className="ms-3">File Manager</span>
                </div>
              </Link>
            </ul>
          </div>
        </aside>

        <div className="w-full overflow-y-scroll">
          {!user.isVerified ? (
            <UserNotVerifiedPage user={user} />
          ) : displayData == "myBills" ? (
            <MyBillsComponent user={user} />
          ) : displayData == "currentMonth" ? (
            <CurrentMonthComponent user={user} />
          ) : displayData == "managerDetails" ? (
            <ManagerDetailsComponent user={user} />
          ) : displayData == "fileManager" ? (
            <FileUpload />
          ) : (
            <ProfileComponent user={user} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
