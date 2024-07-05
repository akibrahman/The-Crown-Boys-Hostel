// pages/index.js
"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import io from "socket.io-client";

const Home = () => {
  const socket = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    socket.current = io("https://crown-camera-server.glitch.me");
  }, []);

  useEffect(() => {
    socket.current.on("video-stream", async (data) => {
      //
      const blob = new Blob([data], { type: "image/jpeg" });
      const url = URL.createObjectURL(blob);
      console.log(url);
      videoRef.current.src = url;
      //
    });
  });

  return (
    <div>
      <h1>ESP32 CAM Video Stream</h1>
      <Image ref={videoRef} alt="Video Stream" height={500} width={500} />
    </div>
  );
};

export default Home;
