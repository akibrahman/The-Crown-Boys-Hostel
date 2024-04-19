"use client";

import { AuthContext } from "@/providers/ContextProvider";
import axios from "axios";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { FaTimes } from "react-icons/fa";
import { TiTick } from "react-icons/ti";

const VerifyEmail = () => {
  const { userRefetch } = useContext(AuthContext);
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const [verifing, setVerifing] = useState(false);

  const verifyUserEmail = async () => {
    setVerifing(true);
    try {
      const { data } = await axios.post("/api/verifyemail", { token });
      if (data.success) {
        await userRefetch();
        setVerified(true);
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

  useEffect(() => {
    if (token?.length > 0) {
      verifyUserEmail();
    }
  }, [token]);

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-5 min-h-screen py-2 dark:bg-gradient-to-r dark:from-primary dark:to-secondary dark:text-white font-semibold">
      <div className="text-right">
        <p className="text-5xl font-bold mb-3">Manager Expo</p>
        <p className="text-[12px]">A Quality Meal Management System</p>
        <p className="text-[12px] text-sky-500 leading-none">
          Designed & Developed by{" "}
          <a href="https://portfolio-akib.web.app" target="_blank">
            <span className="font-bold underline">Akib Rahman</span>
          </a>
        </p>
      </div>
      <div>
        <p className="text-blue-500">Token Verifing Section</p>
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
              Token Verified <TiTick />
            </p>
            <Link href={"/profile"}>
              <button className="px-8 text-white py-1 rounded-full my-2 duration-300 active:scale-90 bg-green-500">
                Profile
              </button>
            </Link>
          </>
        ) : error ? (
          <>
            <p className="flex items-center gap-2 text-red-500">
              Verification Error, try again! <FaTimes />
            </p>
            <Link href={"/signin"}>
              <button className="px-8 text-white py-1 rounded-full my-2 duration-300 active:scale-90 bg-orange-500">
                Login
              </button>
            </Link>
          </>
        ) : null}
        {/* {!verified && (
          <div>
            <p>Email Verified</p>
            <Link href={"/"}>Go Home</Link>
          </div>
        )}
        {error && (
          <div>
            <p>Verification Error, try again!</p>
            <Link href={"/profile"}>Go Profile</Link>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default VerifyEmail;
