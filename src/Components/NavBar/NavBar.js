"use client";

import { AuthContext } from "@/providers/ContextProvider";
import Link from "next/link";
import { useContext } from "react";

const NavBar = () => {
  const { user } = useContext(AuthContext);
  return (
    <nav className="flex items-center justify-center gap-10 py-4 bg-stone-900">
      <Link href="/">Home</Link>
      <Link href="/blog">Blog</Link>
      <Link href="/gallery">Gallery</Link>
      <Link href="/aboutUs">About Us</Link>
      <Link href="/contactUs">Contact Us</Link>

      {user ? (
        <Link
          className="bg-yellow-500 hover:bg-yellow-600 text-stone-900 font-bold px-4 py-1 rounded-lg duration-300 active:scale-90"
          href="/profile"
        >
          Profile
        </Link>
      ) : (
        <Link
          className="bg-yellow-500 hover:bg-yellow-600 text-stone-900 font-bold px-4 py-1 rounded-lg duration-300 active:scale-90"
          href="/signin"
        >
          Log In
        </Link>
      )}
    </nav>
  );
};

export default NavBar;
