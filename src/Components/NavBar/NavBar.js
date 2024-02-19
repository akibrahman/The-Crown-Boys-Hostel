"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";

const NavBar = () => {
  const { data: user } = useQuery({
    queryKey: ["profile", "user", "NavBar"],
    queryFn: async () => {
      try {
        const { data } = await axios.get("/api/users/me");
        return data.user;
      } catch (error) {
        route.push("/login");
        return null;
      }
    },
  });
  // if (!user) return;
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
          href="/login"
        >
          Log In
        </Link>
      )}
    </nav>
  );
};

export default NavBar;
