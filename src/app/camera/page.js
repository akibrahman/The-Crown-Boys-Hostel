// pages/index.js
"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const Home = () => {
  const socket = useRef(null);
  const videoRef = useRef(null);
  const [image, setImage] = useState("/images/about/about-image-2-dark.svg");

  useEffect(() => {
    socket.current = io("https://the-crown-socket-server.glitch.me");
  }, []);

  useEffect(() => {
    socket.current.on("image_upload", async (data) => {
      if (data) setImage(`data:image/jpeg;base64,${data}`);
    });
  });

  return (
    <div>
      <h1>ESP32 CAM Video Stream</h1>
      <Image src={image} alt="Video Stream" height={500} width={500} />
    </div>
  );
};

export default Home;
