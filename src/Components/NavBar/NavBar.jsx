"use client";

import { AuthContext } from "@/providers/ContextProvider";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { FaBars, FaTimes } from "react-icons/fa";
import ThemeSwitch from "../ThemeSwitch/ThemeSwitch";

const NavBar = () => {
  const { user, loading } = useContext(AuthContext);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [deviceWidth, setDeviceWidth] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const width = parseInt(window.innerWidth);
      setDeviceWidth(width);
      const handleResize = () => {
        setDeviceWidth(parseInt(window.innerWidth));
      };
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);
  return (
    <div className="relative">
      {/*//! For Desktop  */}
      <div
        className={`${
          deviceWidth <= 500 ? "hidden" : "flex"
        } dark:bg-gradient-to-r dark:from-primary dark:to-secondary bg-white text-black dark:text-stone-300 flex-col md:flex-row gap-5 md:gap-0 items-center justify-between px-10`}
      >
        <div className="flex items-center">
          <Image
            src="/images/logo.png"
            width={"80"}
            height={"80"}
            alt="Logo"
            className="h-20 w-20 p-1 rounded-full"
          />
          <p className="text-sky-500 text-sm">
            For any Query Call:{" "}
            <Link href={"tel:01709605097"} className="underline">
              01709-605097
            </Link>
          </p>
        </div>
        <div className="flex items-center justify-center gap-10">
          <p className="">
            <Link href="/">Home</Link>
          </p>
          {loading
            ? null
            : user &&
              user.success &&
              user.isClient &&
              user.isClientVerified && (
                <p>
                  <Link href="/order">Order</Link>
                </p>
              )}
          {/* <p> */}
          {/* <Link className="pointer-events-none text-stone-400" href="/help">
            Support
          </Link> */}
          {/* <Link className="pointer-events-none text-stone-400" href="/help">
            Contact Us
          </Link> */}
          <Link className="" href="/about-us">
            About Us
          </Link>
          {/* <Link className="pointer-events-none text-stone-400" href="/help">
            Our Gallery
          </Link> */}
          {/* </p> */}

          {loading ? (
            <CgSpinner className="text-2xl text-lime-500 animate-spin" />
          ) : (
            (user && user.success) || (
              <p
                onClick={() => {
                  toast.success("Comming soon!");
                }}
                className="bg-lime-500 hover:bg-lime-600 text-stone-900 font-bold px-4 py-1 rounded-lg duration-300 active:scale-90 w-max cursor-pointer"
              >
                Guardian&apos;s query
              </p>
            )
          )}

          {loading ? (
            <CgSpinner className="text-2xl text-sky-500 animate-spin" />
          ) : user && user.success ? (
            <p>
              <Link
                className="bg-sky-500 hover:bg-blue-600 text-stone-900 font-bold px-4 py-1 rounded-lg duration-300 active:scale-90"
                href="/profile"
              >
                Profile
              </Link>
            </p>
          ) : (
            <p>
              <Link
                className="bg-sky-500 hover:bg-sky-600 text-stone-900 font-bold px-4 py-1 rounded-lg duration-300 active:scale-90 w-max"
                href="/signin"
              >
                Log In
              </Link>
            </p>
          )}

          <ThemeSwitch />
        </div>
      </div>
      {/*//! For Modile  */}
      <div className={`relative ${deviceWidth <= 500 ? "" : "hidden"}`}>
        <div className="flex dark:bg-gradient-to-r dark:from-primary dark:to-secondary bg-white text-black dark:text-white py-1 gap-5 md:gap-0 items-center justify-between px-3 md:px-10">
          <div className="flex items-center">
            <Image
              src="/images/logo.png"
              width={"60"}
              height={"60"}
              alt="Logo"
              className="h-20 w-20 p-1 rounded-full"
            />
            <p className="text-sky-500 text-xs">
              For any Query Call:{" "}
              <Link href={"tel:01709605097"} className="underline">
                01709-605097
              </Link>
            </p>
          </div>
          {isSideBarOpen ? (
            <FaTimes
              className="text-2xl"
              onClick={() => setIsSideBarOpen(false)}
            />
          ) : (
            <FaBars
              className="text-2xl"
              onClick={() => setIsSideBarOpen(true)}
            />
          )}
        </div>
        <div
          className={`duration-300 ease-linear transition-all ffflex flex-col items-center justify-center gap-5 md:gap-10 dark:bg-gradient-to-r dark:from-primary dark:to-secondary bg-white text-black dark:text-white py-5 absolute w-full z-50 border-b border-blue-500 ${
            isSideBarOpen ? "flex" : "hidden"
          }`}
        >
          <p className="">
            <Link onClick={() => setIsSideBarOpen(false)} href="/">
              Home
            </Link>
          </p>

          {loading
            ? null
            : user &&
              user.success &&
              user.isClient &&
              user.isClientVerified && (
                <p>
                  <Link onClick={() => setIsSideBarOpen(false)} href="/order">
                    Order
                  </Link>
                </p>
              )}
          {/* <p> */}
          {/* <Link
            onClick={() => setIsSideBarOpen(false)}
            className="pointer-events-none text-stone-400"
            href="/help"
          >
            Support
          </Link> */}
          {/* <Link
            onClick={() => setIsSideBarOpen(false)}
            className="pointer-events-none text-stone-400"
            href="/help"
          >
            Contact Us
          </Link> */}
          <Link
            onClick={() => setIsSideBarOpen(false)}
            className=""
            href="/about-us"
          >
            About Us
          </Link>
          {/* <Link
            onClick={() => setIsSideBarOpen(false)}
            className="pointer-events-none text-stone-400"
            href="/help"
          >
            Our Gallery
          </Link> */}
          {/* </p> */}
          {loading ? (
            <CgSpinner className="text-2xl text-lime-500 animate-spin" />
          ) : (
            (user && user.success) || (
              <p
                onClick={() => {
                  toast.success("Comming soon!");
                }}
                className="bg-lime-500 hover:bg-lime-600 text-stone-900 font-bold px-4 py-1 rounded-lg duration-300 active:scale-90 w-max cursor-pointer"
              >
                Guardian&apos;s query
              </p>
            )
          )}
          {loading ? (
            <CgSpinner className="text-2xl text-sky-500 animate-spin" />
          ) : user && user.success ? (
            <p>
              <Link
                onClick={() => setIsSideBarOpen(false)}
                className="bg-sky-500 hover:bg-blue-600 text-stone-900 font-bold px-4 py-1 rounded-lg duration-300 active:scale-90"
                href="/profile"
              >
                Profile
              </Link>
            </p>
          ) : (
            <p>
              <Link
                onClick={() => setIsSideBarOpen(false)}
                className="bg-sky-500 hover:bg-sky-600 text-stone-900 font-bold px-4 py-1 rounded-lg duration-300 active:scale-90 w-max"
                href="/signin"
              >
                Log In
              </Link>
            </p>
          )}

          <ThemeSwitch />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
