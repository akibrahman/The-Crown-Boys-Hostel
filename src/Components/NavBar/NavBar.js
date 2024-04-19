"use client";

import { AuthContext } from "@/providers/ContextProvider";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { CgSpinner } from "react-icons/cg";
import ThemeSwitch from "../ThemeSwitch/ThemeSwitch";

const NavBar = () => {
  const { user, loading } = useContext(AuthContext);
  return (
    <div className="dark:bg-stone-900 bg-white text-black dark:text-white py-3 flex flex-col md:flex-row gap-5 md:gap-0 items-center justify-between md:px-32">
      <Image
        src="/images/logo-white.png"
        width={"50"}
        height={"50"}
        alt="Logo"
        className=""
      />
      <div className="flex items-center justify-center gap-5 md:gap-10">
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
        <p>
          <Link href="/blog">Blog</Link>
        </p>
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
  );
};

export default NavBar;
