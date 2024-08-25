"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

const FloodHelpComponent = () => {
  const route = useRouter();
  const [show, setShow] = useState(true);
  if (show)
    return (
      <motion.div
        initial={{ x: "-50%", y: -50, opacity: 0 }}
        whileInView={{ x: "-50%", y: 0, opacity: 1 }}
        transition={{ type: "just", stiffness: 100, damping: 10 }}
        className="absolute top-5 left-1/2 transform bg-white border-2 border-green-500 py-8 px-10 z-[10000] w-[90%] rounded-md text-slate-800"
      >
        বন্যার্তদের সহযোগিতায় এগিয়ে আসুন আপনার সাধ্যমত, আপনাদের অতি ক্ষুদ্র
        অনুদানই এই ক্রান্তিকাল মোকাবেলায় ঢাল স্বরুপ, আপনার সামর্থ আনুযায়ী ডোনেট
        করুন -{" "}
        <span
          onClick={() =>
            route.push("https://assunnahfoundation.org/donate/flood")
          }
          className="font-semibold text-green-500 cursor-pointer underline"
        >
          আস-সুন্নাহ ফাউন্ডেশন
        </span>
        <FaTimes
          onClick={() => setShow(false)}
          className="absolute top-2 right-2 cursor-pointer text-lg text-green-500 duration-300 active:scale-90 hover:scale-105"
        />
      </motion.div>
    );
};

export default FloodHelpComponent;
