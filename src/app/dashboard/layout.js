"use client";

import AuthorizationNeede from "@/Components/Dashboard/AuthorizationNeede";
import UserNotVerifiedPage from "@/Components/Dashboard/UserNotVerifiedPage";
import PreLoader from "@/Components/PreLoader/PreLoader";
import { AuthContext } from "@/providers/ContextProvider";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { BsHouseAdd, BsHouses } from "react-icons/bs";
import { CgCalendarDates, CgProfile, CgSpinner } from "react-icons/cg";
import {
  FaAddressCard,
  FaBook,
  FaCashRegister,
  FaFile,
  FaFileInvoiceDollar,
  FaSms,
  FaUsers,
} from "react-icons/fa";
import { FaBagShopping, FaMoneyBillTrendUp } from "react-icons/fa6";
import { GiHotMeal } from "react-icons/gi";
import { GrUserManager } from "react-icons/gr";
import { IoIosNotifications } from "react-icons/io";
import { MdNoMeals, MdOutlineUpdate, MdSettings } from "react-icons/md";
import { RiBillFill } from "react-icons/ri";
import {
  TbBrandBooking,
  TbBrandShopee,
  TbCoinTaka,
  TbDeviceIpadDollar,
} from "react-icons/tb";
import { VscGraphLine } from "react-icons/vsc";

const Layout = ({ children }) => {
  const { user } = useContext(AuthContext);
  const route = useRouter();

  const [profileBarShown, setProfileBarShown] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [sideBarShown, setSideBarShown] = useState(false);

  const pathname = usePathname();
  const displayData = pathname.split("/")[2] || "";

  const logout = async () => {
    setLoggingOut(true);
    try {
      const { data } = await axios.get("/api/users/logout");
      if (data.success) {
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

  let sideBarData = [];

  if (user?.isClient && user?.isClientVerified && user?.role == "client")
    sideBarData = [
      {
        title: "Profile",
        href: "/dashboard",
        icon: CgProfile,
        displayData: "",
      },
      {
        title: "Current Month",
        href: "/dashboard/current_month",
        icon: CgCalendarDates,
        displayData: "current_month",
      },
      {
        title: "My Bills",
        href: "/dashboard/my_bills",
        icon: TbCoinTaka,
        displayData: "my_bills",
      },
      {
        title: "Manager Details",
        href: "/dashboard/manager_details",
        icon: GrUserManager,
        displayData: "manager_details",
      },
      {
        title: "Meal History",
        href: "/dashboard/meal_history",
        icon: GiHotMeal,
        displayData: "meal_history",
      },
      {
        title: "File Manager",
        href: "/dashboard/file_manager",
        icon: FaFile,
        displayData: "file_manager",
      },
    ];
  else if (
    user?.isManager &&
    user?.isManagerVerified &&
    user?.role == "manager"
  )
    sideBarData = [
      {
        title: "Profile",
        href: "/dashboard",
        icon: CgProfile,
        displayData: "",
      },
      {
        title: "Clients",
        href: "/dashboard/clients",
        icon: FaUsers,
        displayData: "clients",
      },
      {
        title: "Market Details",
        href: "/dashboard/market_details",
        icon: FaBagShopping,
        displayData: "market_details",
      },
      {
        title: "Order Status",
        href: "/dashboard/order_status",
        icon: VscGraphLine,
        displayData: "order_status",
      },
      {
        title: "Send SMS",
        href: "/dashboard/send_sms",
        icon: FaSms,
        displayData: "send_sms",
      },
      {
        title: "Send Notification",
        href: "/dashboard/send_notification",
        icon: IoIosNotifications,
        displayData: "send_notification",
      },
      {
        title: "Set Charge",
        href: "/dashboard/set_charge",
        icon: RiBillFill,
        displayData: "set_charge",
      },
      {
        title: "Count Charge",
        href: "/dashboard/count_charge",
        icon: TbDeviceIpadDollar,
        displayData: "count_charge",
      },
      {
        title: "Bills",
        href: "/dashboard/bills",
        icon: FaMoneyBillTrendUp,
        displayData: "bills",
      },
      {
        title: "Transactions",
        href: "/dashboard/transactions",
        icon: FaCashRegister,
        displayData: "transactions",
      },
      {
        title: "Meal Query",
        href: "/dashboard/meal_query",
        icon: GiHotMeal,
        displayData: "meal_query",
      },
      {
        title: "Market Query",
        href: "/dashboard/market_query",
        icon: TbBrandShopee,
        displayData: "market_query",
      },
      {
        title: "Meal Sync",
        href: "/dashboard/meal_sync",
        icon: MdOutlineUpdate,
        displayData: "meal_sync",
      },
      {
        title: "RFID",
        href: "/dashboard/rfid",
        icon: FaAddressCard,
        displayData: "rfid",
      },
      {
        title: "Add Room",
        href: "/dashboard/add_room",
        icon: BsHouseAdd,
        displayData: "add_room",
      },
      {
        title: "Rooms",
        href: "/dashboard/rooms",
        icon: BsHouses,
        displayData: "rooms",
      },
      {
        title: "Bookings",
        href: "/dashboard/bookings",
        icon: TbBrandBooking,
        displayData: "bookings",
      },
      {
        title: "Meal Requests",
        href: "/dashboard/meal_change_requests",
        icon: MdNoMeals,
        displayData: "meal_change_requests",
      },
      {
        title: "Invoice",
        href: "/dashboard/invoice",
        icon: FaFileInvoiceDollar,
        displayData: "invoice",
      },
      {
        title: "Books",
        href: "/dashboard/books",
        icon: FaBook,
        displayData: "books",
      },
      {
        title: "File Manager",
        href: "/dashboard/file_manager",
        icon: FaFile,
        displayData: "file_manager",
      },
    ];
  else if (user?.role == "owner")
    sideBarData = [
      {
        title: "Profile",
        href: "/dashboard",
        icon: CgProfile,
        displayData: "",
      },
      {
        title: "Control Panel",
        href: "/dashboard/control_panel",
        icon: MdSettings,
        displayData: "control_panel",
      },
    ];

  if (!user) return <PreLoader />;

  if (!user.isVerified)
    return (
      <div className="h-[calc(100vh-85px)]">
        <UserNotVerifiedPage user={user} />
      </div>
    );
  if (
    user.isVerified &&
    ((user.role == "client" && !user.isClientVerified) ||
      (user.role == "manager" && !user.isManagerVerified))
  )
    return (
      <div className="h-[calc(100vh-85px)]">
        <AuthorizationNeede user={user} />
      </div>
    );

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
          className={`absolute md:relative h-[calc(100vh-130px)] py-10 transition-transform border-r z-10 md:z-0 border-gray-700 ${
            sideBarShown
              ? "w-72 md:w-72 bg-opacity-95 md:bg-opacity-100 bg-gray-800"
              : "w-0 md:w-72 md:bg-gray-800"
          }`}
        >
          <div
            className={`h-full pb-4 overflow-y-auto ${
              sideBarShown ? "px-3 md:px-3" : "px-0 md:px-3"
            }`}
          >
            <ul className="font-medium flex flex-col gap-2">
              {sideBarData.map((__dc, __i) => (
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
            </ul>
          </div>
        </aside>
        {/* Child  */}
        <div className="w-full overflow-y-scroll z-0">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
