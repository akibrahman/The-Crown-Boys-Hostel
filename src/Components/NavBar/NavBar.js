"use client";

import { AuthContext } from "@/providers/ContextProvider";
import Link from "next/link";
import { useContext } from "react";
import ThemeSwitch from "../ThemeSwitch/ThemeSwitch";

const NavBar = () => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return;
  return (
    <div className="flex items-center justify-center gap-10 dark:bg-stone-900 bg-white text-black dark:text-white py-5">
      <p className="">
        <Link href="/">Home</Link>
      </p>
      <p>
        <Link href="/order">Order</Link>
      </p>
      <p>
        <Link href="/blog">Blog</Link>
      </p>
      {loading ? null : user && user.success ? (
        <p>
          <Link
            className="bg-sky-500 hover:bg-yellow-600 text-stone-900 font-bold px-4 py-1 rounded-lg duration-300 active:scale-90"
            href="/profile"
          >
            Profile
          </Link>
        </p>
      ) : (
        <p>
          <Link
            className="bg-sky-500 hover:bg-yellow-600 text-stone-900 font-bold px-4 py-1 rounded-lg duration-300 active:scale-90"
            href="/signin"
          >
            Log In
          </Link>
        </p>
      )}

      <ThemeSwitch />
    </div>
  );
};

export default NavBar;
