"use client";
import axios from "axios";
import Image from "next/image";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";

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
  //-------------------------
  const [tradeLicences, setTradeLicences] = useState([]);
  const [logo, setLogo] = useState(null);

  const [profilePicture, setProfilePicture] = useState(null);
  const [nid, setNid] = useState(null);
  const [passport, setPassport] = useState([]);

  const [slip, setSlip] = useState(null);

  const handleFileChange = (event) => {
    setTradeLicences(event.target.files);
  };
  const handleFileChange2 = (event) => {
    setPassport(event.target.files);
  };

  const preRegId = "66a6464639a5457c3d8fb763";
  const otp = "198375";
  const userId = "66a6468439a5457c3d8fb769";

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("profilepicture", profilePicture);
    formData.append("nid", nid);
    // for (let i = 0; i < passport.length; i++) {
    //   if (i >= 2) break;
    //   formData.append("passport", passport[i]);
    // }
    // formData.append("logo", logo);
    // for (let i = 0; i < tradeLicences.length; i++) {
    //   formData.append("tradelicences", tradeLicences[i]);
    // }

    formData.append(
      "info",
      JSON.stringify({
        accounType: "personal",
        name: "Akib Rahman",
        gender: "Male",
        address: "Dhaka, Uttara 10",
        profession: "Engineer",
        currency: "BDT",
        isNid: true,
        pin: "1234",
      })
    );

    try {
      const { data } = await axios.post(
        "http://localhost:8888/signup",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "user-id": userId,
            "acc-type": "personal",
          },
        }
      );
      if (data.success) {
        toast.success(data.msg);
      }
    } catch (error) {
      toast.error("Error");
      console.error("Error uploading files:", error);
    }
  };

  const paymentInfo = {
    preRegId: preRegId,
    accounType: "personal",
    paymentType: "mfs",
    amount: 10,
    currentSubscription: "1",
    merchantNumber: "01709605097",
    businessName: "BUSI Name",
    transactionId: "hksjdhwikeu7w364e8792346",
    methode: "bkash",
    //
    // bankName: "",
    // accountName: "",
    // accountNumber: "",
    // branchName: "",
    // routingNumber: "",
  };

  const spacu = async () => {
    const formData = new FormData();
    formData.append("bankslip", slip);
    formData.append(
      "info",
      JSON.stringify({
        preRegId: preRegId,
        accounType: "personal",
        paymentType: "bank",
        amount: 10,
        currentSubscription: "1",
        methode: "bank",
        bankName: "Brack",
        accountName: "Akib Brack",
        accountNumber: "123456",
        branchName: "Dhaka Brack",
        routingNumber: "2222",
      })
    );
    try {
      const { data } = await axios.post(
        "http://localhost:8888/subscription-payment",
        formData,
        {
          headers: {
            // "Content-Type": "multipart/form-data",
            "prereg-id": preRegId,
          },
        }
      );
      if (data.success) toast.success(data.msg);
      console.log(data);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const login = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:8888/login",
        {
          isNumber: true,
          number: "01521787402",
          pin: "1234",
        },
        { withCredentials: true }
      );
      if (data.success) toast.success(data.msg);
      console.log(data);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      {" "}
      <div className="p-10 m-10 border border-green-500 rounded-md flex flex-col gap-10">
        <div className="flex items-center gap-10">
          <p>Pre Reg Post:</p>
          <button
            className="text-white bg-green-500 px-4 py-1 duration-300 active:scale-90 font-semibold"
            onClick={async () => {
              try {
                const { data } = await axios.post(
                  "http://localhost:8888/preregistration",
                  {
                    isNumber: true,
                    // email: "akibrahman5200@gmail.com",
                    number: "01521787402",
                    country: "Bangladesh",
                  }
                );
                if (data.success) toast.success(data.msg);
                console.log(data);
              } catch (error) {
                console.log(error);
                toast.error(error.response.data.msg);
              }
            }}
          >
            Action
          </button>
        </div>
        <div className="flex items-center gap-10">
          <p>OTP Check:</p>
          <button
            className="text-white bg-green-500 px-4 py-1 duration-300 active:scale-90 font-semibold"
            onClick={async () => {
              try {
                const { data } = await axios.put(
                  "http://localhost:8888/preregistration/otpchecker",
                  {
                    otp: otp,
                    preRegId: preRegId,
                  }
                );
                if (data.success) toast.success(data.msg);
                console.log(data);
              } catch (error) {
                console.log(error);
                toast.error(error.response.data.message);
              }
            }}
          >
            Action
          </button>
        </div>
        <div className="flex items-center gap-10">
          <p>Subscription Payment and User Create Post:</p>
          <button
            className="text-white bg-green-500 px-4 py-1 duration-300 active:scale-90 font-semibold"
            onClick={spacu}
          >
            Action
          </button>
          <input
            type="file"
            name="bankslip"
            onChange={(e) => setSlip(e.target.files[0])}
          />
        </div>
        <form onSubmit={handleSubmit} className="flex items-center gap-10">
          <input
            type="file"
            onChange={(e) => setProfilePicture(e.target.files[0])}
          />
          <input type="file" onChange={(e) => setNid(e.target.files[0])} />
          <input type="file" multiple onChange={handleFileChange2} />
          <input type="file" onChange={(e) => setLogo(e.target.files[0])} />
          <input type="file" multiple onChange={handleFileChange} />
          <button
            className="text-white bg-green-500 px-4 py-1 duration-300 active:scale-90 font-semibold"
            type="submit"
          >
            Action
          </button>
        </form>
        <button
          onClick={login}
          className="text-white bg-green-500 px-4 py-1 duration-300 active:scale-90 font-semibold"
        >
          Login
        </button>
      </div>
      <button
        onClick={async () => {
          const { data } = await axios.put(
            "http://localhost:8888/preregistration/otpchecker",
            {
              otp: "123456",
              preRegId: "66a5d5dc914862d852b5f674",
            }
          );
          console.log(data);
          if (data.success) toast.success("Done");
          else toast.error("Error");
        }}
      >
        Test
      </button>
    </>
    // <div>
    //   <h1>MULTIPLE ESP32CAM DASHBOARD</h1>
    //   <div class="cards">
    //     <div class="card">
    //       <Image
    //         height={500}
    //         width={500}
    //         alt="Video"
    //         id="ESP32-1"
    //         ref={videoRef}
    //       />
    //       <h2>
    //         <b>CAM 1</b>
    //       </h2>
    //     </div>
    //   </div>
    // </div>
  );
};

export default Cameraa;
