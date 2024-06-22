"use client";

import { AuthContext } from "@/providers/ContextProvider";
import axios from "axios";
import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { FaTimes } from "react-icons/fa";
import { TiTick } from "react-icons/ti";

const ForgotPassword = () => {
  const { userRefetch } = useContext(AuthContext);
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const [verifing, setVerifing] = useState(false);
  const newPass = useRef();
  const newPassC = useRef();

  const chnagePass = async () => {
    if (!newPass.current.value || !newPassC.current.value)
      return toast.error("Enter Passwords");
    if (newPass.current.value != newPassC.current.value)
      return toast.error("Passwords are not same");
    setVerifing(true);
    try {
      const { data } = await axios.post("/api/forgotpassword", {
        token,
        pass: newPass.current.value,
      });
      if (data.success) {
        await userRefetch();
        setVerified(true);
        toast.success("Password reset successfully");
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
      console.log(error.response.data);
    } finally {
      setVerifing(false);
    }
  };

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-5 min-h-screen py-2 dark:bg-gradient-to-r dark:from-primary dark:to-secondary dark:text-white font-semibold">
      <div className="flex flex-col md:flex-row items-center justify-center gap-5">
        <div className="text-right">
          <p className="text-5xl font-bold mb-3">The Crown</p>
          <p className="text-[12px]">A Quality Meal Management System</p>
          <p className="text-[12px] text-sky-500 leading-none">
            Designed & Developed by{" "}
            <Link href="https://portfolio-akib.web.app" target="_blank">
              <span className="font-bold underline">Akib Rahman</span>
            </Link>
          </p>
        </div>
        <div>
          <p className="text-blue-500">Password Recovery Section</p>
          {verifing ? (
            <p className="flex items-center gap-2 text-lime-500">
              Verifing Token{" "}
              <CgSpinner
                className="text-xl animate-spin
            "
              />
            </p>
          ) : verified ? (
            <>
              <p className="flex items-center gap-2 text-green-500">
                Token Verified & Password Chnaged <TiTick />
              </p>
              <Link href={"/signin"}>
                <button className="px-8 text-white py-1 rounded-full my-2 duration-300 active:scale-90 bg-green-500">
                  Login
                </button>
              </Link>
            </>
          ) : error ? (
            <>
              <p className="flex items-center gap-2 text-red-500">
                Verification Error, try again! <FaTimes />
              </p>
              {/* <Link href={"/signin"}>
                <button className="px-8 text-white py-1 rounded-full my-2 duration-300 active:scale-90 bg-orange-500">
                  Login
                </button>
              </Link> */}
            </>
          ) : null}
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-4 mt-6">
        <input
          ref={newPass}
          className="px-10 py-3 font-semibold bg-transparent border"
          placeholder="Enter your new passsword"
        />
        <input
          ref={newPassC}
          className="px-10 py-3 font-semibold bg-transparent border"
          placeholder="Confirm your new passsword"
        />
        <button
          onClick={chnagePass}
          className="bg-sky-500 px-5 text-sm py-2 rounded-full duration-300 active:scale-90 hover:scale-105"
        >
          Verify Token & Change Password
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
