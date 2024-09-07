"use client";
import { AuthContext } from "@/providers/ContextProvider";
import axios from "axios";
import Image from "next/image";
import { VscGraphLine } from "react-icons/vsc";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
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
import UnderConstruction from "../UnderConstruction/UnderConstruction";
import OwnerControlPanel from "./Owner/OwnerControlPanel";
import ManagerAddARoom from "./Manager/ManagerAddARoom";
import { BsHouseAdd, BsHouses } from "react-icons/bs";
import ManagerAllRoomsComponent from "./Manager/ManagerAllRoomsComponent";
import useFcmToken from "@/hooks/useFcmToken";
import ManagerSendNotificationComponent from "./Manager/ManagerSendNotificationComponent";

const Dashboard = ({ user }) => {
  // useUnloadWarning("Are");
  const route = useRouter();
  const searchParams = useSearchParams();
  let displayData = searchParams.get("displayData");

  // const [fcmState, setFcmState] = useState([false, ""]);

  const { token } = useFcmToken();
  useEffect(() => {
    if (token && user?._id) {
      // toast.success("FCM Generating...");
      console.log("FCM Generating...");
      axios
        .put("/api/clients/editclient", { fcm: token, _id: user._id })
        .then(() => {
          // toast.success("FCM Generated");
          console.log("FCM Generated");
        })
        .catch((error) => {
          // toast.error("FCM Generating Error");
          console.log("FCM Generating Error");
          console.log(
            error?.response?.data?.msg ||
              error?.message ||
              "Server Error, FCM not Saved"
          );
        });
    }
  }, [token, user?._id]);

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
        displayData == "managerDetails" ||
        displayData == "ownerControlPanel") &&
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
        displayData == "mealChangeRequests" ||
        displayData == "managerAddARoom" ||
        displayData == "ownerControlPanel") &&
      user.role == "client"
    ) {
      displayData = "profile";
    }
  }

  const { userRefetch } = useContext(AuthContext);
  const [profileBarShown, setProfileBarShown] = useState(false);
  const [sideBarShown, setSideBarShown] = useState(false);

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

  const sideBarDataClient = [
    {
      title: "Profile",
      href: "/dashboard?displayData=profile",
      icon: CgProfile,
      displayData: "profile",
    },
    {
      title: "Current Month",
      href: "/dashboard?displayData=currentMonth",
      icon: CgCalendarDates,
      displayData: "currentMonth",
    },
    {
      title: "My Bills",
      href: "/dashboard?displayData=myBills",
      icon: TbCoinTaka,
      displayData: "myBills",
    },
    {
      title: "Manager Details",
      href: "/dashboard?displayData=managerDetails",
      icon: GrUserManager,
      displayData: "managerDetails",
    },
    {
      title: "Meal History",
      href: "/dashboard?displayData=mealHistory",
      icon: GiHotMeal,
      displayData: "mealHistory",
    },
    {
      title: "File Manager",
      href: "/dashboard?displayData=fileManager",
      icon: FaFile,
      displayData: "fileManager",
    },
  ];

  const sideBarDataManager = [
    {
      title: "Profile",
      href: "/dashboard?displayData=managerProfile",
      icon: CgProfile,
      displayData: "managerProfile",
    },
    {
      title: "Clients",
      href: "/dashboard?displayData=managerAllUsers",
      icon: FaUsers,
      displayData: "managerAllUsers",
    },
    {
      title: "Market Details",
      href: "/dashboard?displayData=managerMarketDetails",
      icon: FaBagShopping,
      displayData: "managerMarketDetails",
    },
    {
      title: "Order Status",
      href: "/dashboard?displayData=managerOrderStatus",
      icon: VscGraphLine,
      displayData: "managerOrderStatus",
    },
    {
      title: "Send SMS",
      href: "/dashboard?displayData=managerSendSMS",
      icon: FaSms,
      displayData: "managerSendSMS",
    },
    {
      title: "Send Notification",
      href: "/dashboard?displayData=managerSendNotification",
      icon: FaSms,
      displayData: "managerSendNotification",
    },
    {
      title: "Bill Query",
      href: "/dashboard?displayData=managerBillQuery",
      icon: FaMoneyBillTrendUp,
      displayData: "managerBillQuery",
    },
    {
      title: "Meal Query",
      href: "/dashboard?displayData=managerMealQuery",
      icon: GiHotMeal,
      displayData: "managerMealQuery",
    },
    {
      title: "Market Query",
      href: "/dashboard?displayData=managerMarketQuery",
      icon: TbBrandShopee,
      displayData: "managerMarketQuery",
    },
    {
      title: "Meal Updator",
      href: "/dashboard?displayData=managerMealUpdator",
      icon: MdOutlineUpdate,
      displayData: "managerMealUpdator",
    },
    {
      title: "RFID Issue",
      href: "/dashboard?displayData=managerRFIDIssue",
      icon: FaAddressCard,
      displayData: "managerRFIDIssue",
    },
    {
      title: "Add Room",
      href: "/dashboard?displayData=managerAddARoom",
      icon: BsHouseAdd,
      displayData: "managerAddARoom",
    },
    {
      title: "Rooms",
      href: "/dashboard?displayData=managerAllRooms",
      icon: BsHouses,
      displayData: "managerAllRooms",
    },
    {
      title: "Bookings",
      href: "/dashboard?displayData=managerAllBookings",
      icon: TbBrandBooking,
      displayData: "managerAllBookings",
    },
    {
      title: "Meal Requests",
      href: "/dashboard?displayData=mealChangeRequests",
      icon: MdNoMeals,
      displayData: "mealChangeRequests",
    },
    {
      title: "Invoice",
      href: "/dashboard?displayData=managerManualInvouce",
      icon: FaFileInvoiceDollar,
      displayData: "managerManualInvouce",
    },
    {
      title: "File Manager",
      href: "/dashboard?displayData=fileManager",
      icon: FaFile,
      displayData: "fileManager",
    },
  ];

  const sideBarDataOwner = [
    {
      title: "Profile",
      href: "/dashboard?displayData=profile",
      icon: CgProfile,
      displayData: "profile",
    },
    {
      title: "Control Panel",
      href: "/dashboard?displayData=ownerControlPanel",
      icon: CgProfile,
      displayData: "ownerControlPanel",
    },
  ];

  return (
    <div className="relative">
      {/* FCM Status  */}
      {/* {fcmState[0] && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-[500]">
          <p className="px-6 py-2 rounded-md text-green-500 bg-white text-center">
            {fcmState[1]}
          </p>
        </div>
      )} */}
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
          className={`absolute md:relative h-[calc(100vh-130px)] py-10 transition-transform border-r z-10 border-gray-700 ${
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
              {user &&
                user.isClient &&
                user.isClientVerified &&
                sideBarDataClient.map((__dc, __i) => (
                  <Link
                    key={__i}
                    onClick={() => setSideBarShown(false)}
                    href={__dc.href}
                  >
                    <div
                      className={`flex items-center p-2 rounded-lg text-white group select-none cursor-pointer ${
                        displayData == __dc.displayData
                          ? "bg-gray-700"
                          : "hover:bg-gray-700"
                      }`}
                    >
                      <__dc.icon
                        className={`text-gray-400 md:text-xl ${
                          displayData == __dc.displayData
                            ? "text-white"
                            : "group-hover:text-white"
                        }`}
                      />
                      <span className="ms-3 text-sm md:text-base">
                        {__dc.title}
                      </span>
                    </div>
                  </Link>
                ))}
              {user &&
                user.isManager &&
                user.isManagerVerified &&
                sideBarDataManager.map((__dm, __i) => (
                  <Link
                    key={__i}
                    onClick={() => setSideBarShown(false)}
                    href={__dm.href}
                  >
                    <div
                      className={`flex items-center p-2 rounded-lg text-white group select-none cursor-pointer ${
                        displayData == __dm.displayData
                          ? "bg-gray-700"
                          : "hover:bg-gray-700"
                      }`}
                    >
                      <__dm.icon
                        className={`text-gray-400 md:text-xl ${
                          displayData == __dm.displayData
                            ? "text-white"
                            : "group-hover:text-white"
                        }`}
                      />
                      <span className="ms-3 text-sm md:text-base">
                        {__dm.title}
                      </span>
                    </div>
                  </Link>
                ))}
              {user &&
                user.role == "owner" &&
                sideBarDataOwner.map((__do, __i) => (
                  <Link
                    key={__i}
                    onClick={() => setSideBarShown(false)}
                    href={__do.href}
                  >
                    <div
                      className={`flex items-center p-2 rounded-lg text-white group select-none cursor-pointer ${
                        displayData == __do.displayData
                          ? "bg-gray-700"
                          : "hover:bg-gray-700"
                      }`}
                    >
                      <__do.icon
                        className={`text-gray-400 md:text-xl ${
                          displayData == __do.displayData
                            ? "text-white"
                            : "group-hover:text-white"
                        }`}
                      />
                      <span className="ms-3 text-sm md:text-base">
                        {__do.title}
                      </span>
                    </div>
                  </Link>
                ))}
            </ul>
          </div>
        </aside>

        <div className="w-full overflow-y-scroll z-0">
          {!user.isVerified ? (
            <UserNotVerifiedPage user={user} />
          ) : (user.role == "client" && !user.isClientVerified) ||
            (user.role == "manager" && !user.isManagerVerified) ? (
            <AuthorizationNeede user={user} />
          ) : // For User -----------------------------------
          displayData == "profile" ? (
            <ProfileComponent user={user} />
          ) : displayData == "currentMonth" ? (
            user?.blockDate &&
            moment(user?.blockDate).isBefore(
              moment(
                new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }),
                "M/D/YYYY, h:mm:ss A"
              ),
              "day"
            ) ? (
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
            user?.blockDate &&
            moment(user?.blockDate).isBefore(
              moment(
                new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }),
                "M/D/YYYY, h:mm:ss A"
              ),
              "day"
            ) ? (
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
          ) : //  <UnderConstruction />
          displayData == "managerSendNotification" ? (
            <ManagerSendNotificationComponent user={user} />
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
          ) : displayData == "managerAddARoom" ? (
            <ManagerAddARoom user={user} />
          ) : displayData == "managerAllRooms" ? (
            <ManagerAllRoomsComponent user={user} />
          ) : displayData == "mealChangeRequests" ? (
            <ManagerMealChangeRequestsComponent user={user} />
          ) : // For Owner --------------------------
          displayData == "ownerControlPanel" ? (
            <OwnerControlPanel user={user} />
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
