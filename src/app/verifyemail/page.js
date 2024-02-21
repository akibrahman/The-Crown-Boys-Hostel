"use client";

import { AuthContext } from "@/providers/ContextProvider";
import axios from "axios";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

const VerifyEmail = () => {
  const { userRefetch } = useContext(AuthContext);
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

  const verifyUserEmail = async () => {
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
    }
  };

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken);
  }, []);

  useEffect(() => {
    if (token.length > 0) {
      verifyUserEmail();
    }
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <p>Verify E-mail</p>
      <p>{token ? "Token is here" : "No token"}</p>
      {verified && (
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
      )}
    </div>
  );
};

export default VerifyEmail;
