"use client";
import { AuthContext } from "@/providers/ContextProvider";
import axios from "axios";
import Image from "next/image";
import { VscGraphLine } from "react-icons/vsc";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { TbBrandBooking, TbBrandShopee } from "react-icons/tb";
import { CgCalendarDates, CgProfile, CgSpinner } from "react-icons/cg";
import {
  FaAddressCard,
  FaFile,
  FaFileInvoiceDollar,
  FaSms,
  FaUsers,
} from "react-icons/fa";
import { TbCoinTaka } from "react-icons/tb";
import { GrUserManager } from "react-icons/gr";
import ProfileComponent from "./Client/ProfileComponent";
import CurrentMonthComponent from "./Client/CurrentMonthComponent";
import MyBillsComponent from "./Client/MyBillsComponent";
import ManagerDetailsComponent from "./Client/ManagerDetailsComponent";
import FileUpload from "@/app/fileManager/page";
import UserNotVerifiedPage from "./UserNotVerifiedPage";
import { GiHotMeal } from "react-icons/gi";
import MealHistoryComponent from "./Client/MealHistoryComponent";
import ManagerProfileComponent from "./Manager/ManagerProfileComponent";
import ManagerAllUsers from "./Manager/ManagerAllUsers";
import ManagerMarketDetailsComponent from "./Manager/ManagerMarketDetailsComponent";
import { FaBagShopping, FaMoneyBillTrendUp } from "react-icons/fa6";
import ManagerOrderStatusComponent from "./Manager/ManagerOrderStatusComponent";
import ManagerSendSMSComponent from "./Manager/ManagerSendSMSComponent";
import ManagerBillQueryComponent from "./Manager/ManagerBillQueryComponent";
import ManagerMealQueryComponent from "./Manager/ManagerMealQueryComponent";
import ManagerMarketQueryComponent from "./Manager/ManagerMarketQueryComponent";
import ManagerMealUpdatorComponent from "./Manager/ManagerMealUpdatorComponent";
import { MdNoMeals, MdOutlineUpdate } from "react-icons/md";
import ManagerRFIDIssueComponent from "./Manager/ManagerRFIDIssueComponent";
import ManagerManualInvoiceComponent from "./Manager/ManagerManualInvoiceComponent";
import ManagerAllBookingsComponent from "./Manager/ManagerAllBookingsComponent";
import useUnloadWarning from "@/hooks/useUnloadWarning";
import AuthorizationNeede from "./AuthorizationNeede";
import ManagerMealChangeRequestsComponent from "./Manager/ManagerMealChangeRequestsComponent";
import moment from "moment";
import BlockMsg from "../BlockMsg/BlockMsg";

const Dashboard = ({ user }) => {
  useUnloadWarning("Are");
  const route = useRouter();
  const searchParams = useSearchParams();
  let displayData = searchParams.get("displayData");

  if (!displayData) {
    user.role == "manager"
      ? (displayData = "managerProfile")
      : (displayData = "profile");
  }
  if (displayData) {
    if (
      (displayData == "profile" ||
        displayData == "myBills" ||
        displayData == "mealHistory" ||
        displayData == "currentMonth" ||
        displayData == "managerDetails") &&
      user.role == "manager"
    ) {
      displayData = "managerProfile";
    } else if (
      (displayData == "managerAllUsers" ||
        displayData == "managerMarketDetails" ||
        displayData == "managerOrderStatus" ||
        displayData == "managerSendSMS" ||
        displayData == "managerBillQuery" ||
        displayData == "managerMealQuery" ||
        displayData == "managerMarketQuery" ||
        displayData == "managerMealUpdator" ||
        displayData == "managerRFIDIssue" ||
        displayData == "managerAllBookings" ||
        displayData == "managerManualInvouce" ||
        displayData == "mealChangeRequests") &&
      user.role == "client"
    ) {
      displayData = "profile";
    }
  }

  const { userRefetch } = useContext(AuthContext);
  const [profileBarShown, setProfileBarShown] = useState(false);
  const [sideBarShown, setSideBarShown] = useState(false);
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
        <div className="px-3 py-1 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <button
                onClick={() => setSideBarShown(!sideBarShown)}
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
              <Link href="/" className="flex ms-2 md:me-24">
                <span className="self-center text-xl font-semibold whitespace-nowrap text-white">
                  Dashboard
                </span>
              </Link>
            </div>
            <div className="flex items-center">
              <div className="relative flex items-center ms-3 text-sm md:text-base">
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
          className={`absolute md:relative h-[calc(100vh-130px)] py-10 transition-transform border-r border-gray-700 ${
            sideBarShown
              ? "w-72 md:w-72 bg-opacity-95 md:bg-opacity-100 bg-gray-800"
              : "w-0 md:w-72 md:bg-gray-800"
          }`}
        >
          <div
            className={`h-full pb-4 overflow-y-auto bg-gray800 ${
              sideBarShown ? "px-3 md:px-3" : "px-0 md:px-3"
            }`}
          >
            <ul className="font-medium flex flex-col gap-2">
              {user && user.isClient && user.isClientVerified && (
                <>
                  <Link
                    onClick={() => setSideBarShown(false)}
                    href="/dashboard?displayData=profile"
                  >
                    <div
                      className={`flex items-center p-2 rounded-lg text-white group select-none cursor-pointer ${
                        displayData == "profile"
                          ? "bg-gray-700"
                          : "hover:bg-gray-700"
                      }`}
                    >
                      <CgProfile
                        className={`text-gray-400 md:text-xl ${
                          displayData == "profile"
                            ? "text-white"
                            : "group-hover:text-white"
                        }`}
                      />
                      <span className="ms-3 text-sm md:text-base">Profile</span>
                    </div>
                  </Link>
                  <Link
                    onClick={() => setSideBarShown(false)}
                    href="/dashboard?displayData=currentMonth"
                  >
                    <div
                      className={`flex items-center p-2 rounded-lg text-white group select-none cursor-pointer ${
                        displayData == "currentMonth"
                          ? "bg-gray-700"
                          : "hover:bg-gray-700"
                      }`}
                    >
                      <CgCalendarDates
                        className={`text-gray-400 md:text-xl ${
                          displayData == "currentMonth"
                            ? "text-white"
                            : "group-hover:text-white"
                        }`}
                      />
                      <span className="ms-3 text-sm md:text-base">
                        Current Month
                      </span>
                    </div>
                  </Link>
                  <Link
                    onClick={() => setSideBarShown(false)}
                    href="/dashboard?displayData=myBills"
                  >
                    <div
                      className={`flex items-center p-2 rounded-lg text-white group select-none cursor-pointer ${
                        displayData == "myBills"
                          ? "bg-gray-700"
                          : "hover:bg-gray-700"
                      }`}
                    >
                      <TbCoinTaka
                        className={`text-gray-400 md:text-xl ${
                          displayData == "myBills"
                            ? "text-white"
                            : "group-hover:text-white"
                        }`}
                      />
                      <span className="ms-3 text-sm md:text-base">
                        My Bills
                      </span>
                    </div>
                  </Link>
                  <Link
                    onClick={() => setSideBarShown(false)}
                    href="/dashboard?displayData=managerDetails"
                  >
                    <div
                      className={`flex items-center p-2 rounded-lg text-white group select-none cursor-pointer ${
                        displayData == "managerDetails"
                          ? "bg-gray-700"
                          : "hover:bg-gray-700"
                      }`}
                    >
                      <GrUserManager
                        className={`text-gray-400 md:text-xl ${
                          displayData == "managerDetails"
                            ? "text-white"
                            : "group-hover:text-white"
                        }`}
                      />
                      <span className="ms-3 text-sm md:text-base">
                        Manager Details
                      </span>
                    </div>
                  </Link>
                  <Link
                    onClick={() => setSideBarShown(false)}
                    href="/dashboard?displayData=mealHistory"
                  >
                    <div
                      className={`flex items-center p-2 rounded-lg text-white group select-none cursor-pointer ${
                        displayData == "mealHistory"
                          ? "bg-gray-700"
                          : "hover:bg-gray-700"
                      }`}
                    >
                      <GiHotMeal
                        className={`text-gray-400 md:text-xl ${
                          displayData == "mealHistory"
                            ? "text-white"
                            : "group-hover:text-white"
                        }`}
                      />
                      <span className="ms-3 text-sm md:text-base">
                        Meal History
                      </span>
                    </div>
                  </Link>
                  <Link
                    onClick={() => setSideBarShown(false)}
                    href="/dashboard?displayData=fileManager"
                  >
                    <div
                      className={`flex items-center p-2 rounded-lg text-white group select-none cursor-pointer ${
                        displayData == "fileManager"
                          ? "bg-gray-700"
                          : "hover:bg-gray-700"
                      }`}
                    >
                      <FaFile
                        className={`text-gray-400 md:text-xl ${
                          displayData == "fileManager"
                            ? "text-white"
                            : "group-hover:text-white"
                        }`}
                      />
                      <span className="ms-3 text-sm md:text-base">
                        File Manager
                      </span>
                    </div>
                  </Link>
                </>
              )}
              {user && user.isManager && user.isManagerVerified && (
                <>
                  <Link
                    onClick={() => setSideBarShown(false)}
                    href="/dashboard?displayData=managerProfile"
                  >
                    <div
                      className={`flex items-center p-2 rounded-lg text-white group select-none cursor-pointer ${
                        displayData == "managerProfile"
                          ? "bg-gray-700"
                          : "hover:bg-gray-700"
                      }`}
                    >
                      <CgProfile
                        className={`text-gray-400 md:text-xl ${
                          displayData == "managerProfile"
                            ? "text-white"
                            : "group-hover:text-white"
                        }`}
                      />
                      <span className="ms-3 text-sm md:text-base">Profile</span>
                    </div>
                  </Link>
                  <Link
                    onClick={() => setSideBarShown(false)}
                    href="/dashboard?displayData=managerAllUsers"
                  >
                    <div
                      className={`flex items-center p-2 rounded-lg text-white group select-none cursor-pointer ${
                        displayData == "managerAllUsers"
                          ? "bg-gray-700"
                          : "hover:bg-gray-700"
                      }`}
                    >
                      <FaUsers
                        className={`text-gray-400 md:text-xl ${
                          displayData == "managerAllUsers"
                            ? "text-white"
                            : "group-hover:text-white"
                        }`}
                      />
                      <span className="ms-3 text-sm md:text-base">
                        All Users
                      </span>
                    </div>
                  </Link>
                  <Link
                    onClick={() => setSideBarShown(false)}
                    href="/dashboard?displayData=managerMarketDetails"
                  >
                    <div
                      className={`flex items-center p-2 rounded-lg text-white group select-none cursor-pointer ${
                        displayData == "managerMarketDetails"
                          ? "bg-gray-700"
                          : "hover:bg-gray-700"
                      }`}
                    >
                      <FaBagShopping
                        className={`text-gray-400 md:text-xl ${
                          displayData == "managerMarketDetails"
                            ? "text-white"
                            : "group-hover:text-white"
                        }`}
                      />
                      <span className="ms-3 text-sm md:text-base">
                        Market Details
                      </span>
                    </div>
                  </Link>
                  <Link
                    onClick={() => setSideBarShown(false)}
                    href="/dashboard?displayData=managerOrderStatus"
                  >
                    <div
                      className={`flex items-center p-2 rounded-lg text-white group select-none cursor-pointer ${
                        displayData == "managerOrderStatus"
                          ? "bg-gray-700"
                          : "hover:bg-gray-700"
                      }`}
                    >
                      <VscGraphLine
                        className={`text-gray-400 md:text-xl ${
                          displayData == "managerOrderStatus"
                            ? "text-white"
                            : "group-hover:text-white"
                        }`}
                      />
                      <span className="ms-3 text-sm md:text-base">
                        Order Status
                      </span>
                    </div>
                  </Link>
                  <Link
                    onClick={() => setSideBarShown(false)}
                    href="/dashboard?displayData=managerSendSMS"
                  >
                    <div
                      className={`flex items-center p-2 rounded-lg text-white group select-none cursor-pointer ${
                        displayData == "managerSendSMS"
                          ? "bg-gray-700"
                          : "hover:bg-gray-700"
                      }`}
                    >
                      <FaSms
                        className={`text-gray-400 md:text-xl ${
                          displayData == "managerSendSMS"
                            ? "text-white"
                            : "group-hover:text-white"
                        }`}
                      />
                      <span className="ms-3 text-sm md:text-base">
                        Send SMS
                      </span>
                    </div>
                  </Link>
                  <Link
                    onClick={() => setSideBarShown(false)}
                    href="/dashboard?displayData=managerBillQuery"
                  >
                    <div
                      className={`flex items-center p-2 rounded-lg text-white group select-none cursor-pointer ${
                        displayData == "managerBillQuery"
                          ? "bg-gray-700"
                          : "hover:bg-gray-700"
                      }`}
                    >
                      <FaMoneyBillTrendUp
                        className={`text-gray-400 md:text-xl ${
                          displayData == "managerBillQuery"
                            ? "text-white"
                            : "group-hover:text-white"
                        }`}
                      />
                      <span className="ms-3 text-sm md:text-base">
                        Bill Query
                      </span>
                    </div>
                  </Link>
                  <Link
                    onClick={() => setSideBarShown(false)}
                    href="/dashboard?displayData=managerMealQuery"
                  >
                    <div
                      className={`flex items-center p-2 rounded-lg text-white group select-none cursor-pointer ${
                        displayData == "managerMealQuery"
                          ? "bg-gray-700"
                          : "hover:bg-gray-700"
                      }`}
                    >
                      <GiHotMeal
                        className={`text-gray-400 md:text-xl ${
                          displayData == "managerMealQuery"
                            ? "text-white"
                            : "group-hover:text-white"
                        }`}
                      />
                      <span className="ms-3 text-sm md:text-base">
                        Meal Query
                      </span>
                    </div>
                  </Link>
                  <Link
                    onClick={() => setSideBarShown(false)}
                    href="/dashboard?displayData=managerMarketQuery"
                  >
                    <div
                      className={`flex items-center p-2 rounded-lg text-white group select-none cursor-pointer ${
                        displayData == "managerMarketQuery"
                          ? "bg-gray-700"
                          : "hover:bg-gray-700"
                      }`}
                    >
                      <TbBrandShopee
                        className={`text-gray-400 md:text-xl ${
                          displayData == "managerMarketQuery"
                            ? "text-white"
                            : "group-hover:text-white"
                        }`}
                      />
                      <span className="ms-3 text-sm md:text-base">
                        Market Query
                      </span>
                    </div>
                  </Link>
                  <Link
                    onClick={() => setSideBarShown(false)}
                    href="/dashboard?displayData=managerMealUpdator"
                  >
                    <div
                      className={`flex items-center p-2 rounded-lg text-white group select-none cursor-pointer ${
                        displayData == "managerMealUpdator"
                          ? "bg-gray-700"
                          : "hover:bg-gray-700"
                      }`}
                    >
                      <MdOutlineUpdate
                        className={`text-gray-400 md:text-xl ${
                          displayData == "managerMealUpdator"
                            ? "text-white"
                            : "group-hover:text-white"
                        }`}
                      />
                      <span className="ms-3 text-sm md:text-base">
                        Meal Updator
                      </span>
                    </div>
                  </Link>
                  <Link
                    onClick={() => setSideBarShown(false)}
                    href="/dashboard?displayData=managerRFIDIssue"
                  >
                    <div
                      className={`flex items-center p-2 rounded-lg text-white group select-none cursor-pointer ${
                        displayData == "managerRFIDIssue"
                          ? "bg-gray-700"
                          : "hover:bg-gray-700"
                      }`}
                    >
                      <FaAddressCard
                        className={`text-gray-400 md:text-xl ${
                          displayData == "managerRFIDIssue"
                            ? "text-white"
                            : "group-hover:text-white"
                        }`}
                      />
                      <span className="ms-3 text-sm md:text-base">
                        RFID Issue
                      </span>
                    </div>
                  </Link>
                  <Link
                    onClick={() => setSideBarShown(false)}
                    href="/dashboard?displayData=managerAllBookings"
                  >
                    <div
                      className={`flex items-center p-2 rounded-lg text-white group select-none cursor-pointer ${
                        displayData == "managerAllBookings"
                          ? "bg-gray-700"
                          : "hover:bg-gray-700"
                      }`}
                    >
                      <TbBrandBooking
                        className={`text-gray-400 md:text-xl ${
                          displayData == "managerAllBookings"
                            ? "text-white"
                            : "group-hover:text-white"
                        }`}
                      />
                      <span className="ms-3 text-sm md:text-base">
                        Bookings
                      </span>
                    </div>
                  </Link>
                  <Link
                    onClick={() => setSideBarShown(false)}
                    href="/dashboard?displayData=mealChangeRequests"
                  >
                    <div
                      className={`flex items-center p-2 rounded-lg text-white group select-none cursor-pointer ${
                        displayData == "mealChangeRequests"
                          ? "bg-gray-700"
                          : "hover:bg-gray-700"
                      }`}
                    >
                      <MdNoMeals
                        className={`text-gray-400 md:text-xl ${
                          displayData == "mealChangeRequests"
                            ? "text-white"
                            : "group-hover:text-white"
                        }`}
                      />
                      <span className="ms-3 text-xs">Meal Change Requests</span>
                    </div>
                  </Link>
                  <Link
                    onClick={() => setSideBarShown(false)}
                    href="/dashboard?displayData=managerManualInvouce"
                  >
                    <div
                      className={`flex items-center p-2 rounded-lg text-white group select-none cursor-pointer ${
                        displayData == "managerManualInvouce"
                          ? "bg-gray-700"
                          : "hover:bg-gray-700"
                      }`}
                    >
                      <FaFileInvoiceDollar
                        className={`text-gray-400 md:text-xl ${
                          displayData == "managerManualInvouce"
                            ? "text-white"
                            : "group-hover:text-white"
                        }`}
                      />
                      <span className="ms-3 text-sm md:text-base">
                        Manual Invoice
                      </span>
                    </div>
                  </Link>
                </>
              )}
            </ul>
          </div>
        </aside>

        <div className="w-full overflow-y-scroll">
          {!user.isVerified ? (
            <UserNotVerifiedPage user={user} />
          ) : (user.role == "client" && !user.isClientVerified) ||
            (user.role == "manager" && !user.isManagerVerified) ? (
            <AuthorizationNeede user={user} />
          ) : // For User -----------------------------------
          displayData == "profile" ? (
            <ProfileComponent user={user} />
          ) : displayData == "currentMonth" ? (
            user.blockDate && moment(user.blockDate).isBefore(moment.now(),"day") ? (
              <BlockMsg />
            ) : (
              <CurrentMonthComponent user={user} />
            )
          ) : displayData == "myBills" ? (
            <MyBillsComponent user={user} />
          ) : displayData == "managerDetails" ? (
            <ManagerDetailsComponent user={user} />
          ) : displayData == "mealHistory" ? (
            <MealHistoryComponent user={user} />
          ) : displayData == "fileManager" ? (
            user.blockDate && moment(user.blockDate).isBefore(moment.now(),"day") ? (
              <BlockMsg />
            ) : (
              <FileUpload />
            ) // For Manager -----------------------------------
          ) : displayData == "managerProfile" ? (
            <ManagerProfileComponent user={user} />
          ) : displayData == "managerAllUsers" ? (
            <ManagerAllUsers user={user} />
          ) : displayData == "managerMarketDetails" ? (
            <ManagerMarketDetailsComponent user={user} />
          ) : displayData == "managerOrderStatus" ? (
            <ManagerOrderStatusComponent user={user} />
          ) : displayData == "managerSendSMS" ? (
            <ManagerSendSMSComponent user={user} />
          ) : displayData == "managerBillQuery" ? (
            <ManagerBillQueryComponent user={user} />
          ) : displayData == "managerMealQuery" ? (
            <ManagerMealQueryComponent user={user} />
          ) : displayData == "managerMarketQuery" ? (
            <ManagerMarketQueryComponent user={user} />
          ) : displayData == "managerMealUpdator" ? (
            <ManagerMealUpdatorComponent user={user} />
          ) : displayData == "managerRFIDIssue" ? (
            <ManagerRFIDIssueComponent user={user} />
          ) : displayData == "managerAllBookings" ? (
            <ManagerAllBookingsComponent user={user} />
          ) : displayData == "managerManualInvouce" ? (
            <ManagerManualInvoiceComponent user={user} />
          ) : displayData == "mealChangeRequests" ? (
            <ManagerMealChangeRequestsComponent user={user} />
          ) : // For /dashboard route --------------------------
          user.role == "manager" ? (
            <ManagerProfileComponent user={user} />
          ) : (
            <ProfileComponent user={user} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
