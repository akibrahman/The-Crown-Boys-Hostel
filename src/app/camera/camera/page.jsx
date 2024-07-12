"use client";
import Image from "next/image";
import React, { useRef } from "react";

const Cameraa = () => {
  const videoRef = useRef();
  var imageFrame;
  const WS_URL = "wss://crown-camera-server.glitch.me";
  const ws = new WebSocket(WS_URL);
  let urlObject;
  ws.onopen = () => {
    console.log(`Connected to ${WS_URL}`);
    ws.send("WEB_CLIENT");
  };

  ws.onmessage = async (message) => {
    const arrayBuffer = message.data;
    if (urlObject) {
      URL.revokeObjectURL(urlObject);
    }
    var blobObj = new Blob([arrayBuffer]);
    const buf = await blobObj.arrayBuffer();
    var uint8 = new Uint8Array(buf.slice(12, 13));
    var currentCam = uint8[0];

    urlObject = URL.createObjectURL(blobObj);
    console.log("current Cam: ", currentCam);
    console.log("SRC: ", urlObject);
    videoRef.current.src = urlObject;
  };
  return (
    <div>
      <h1>MULTIPLE ESP32CAM DASHBOARD</h1>
      <div class="cards">
        <div class="card">
          <Image
            height={500}
            width={500}
            alt="Video"
            id="ESP32-1"
            ref={videoRef}
          />
          <h2>
            <b>CAM 1</b>
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Cameraa;
