"use client";
import React, { useEffect, useState } from "react";
import {
  onMessageListener,
  requestFMCToken,
} from "../../../../DealPayAsia/firebase.js";
import toast from "react-hot-toast";

const Notification = () => {
  const [fcmToken, setFcmToken] = useState(null);
  useEffect(() => {
    const fetchFCMToken = async () => {
      try {
        const token = await requestFMCToken();
        setFcmToken(token);
        console.log(token);
      } catch (error) {
        console.error("Error getting FCM token: ", error);
      }
    };
    fetchFCMToken();
  });

  onMessageListener()
    .then((payload) => {
      console.log("Received Foreground Message", payload);
      toast(payload.notification.body);
    })
    .catch((error) => console.error(error));

  return (
    <div className="min-h-screen">
      <p>Akib</p>
      <p>{fcmToken}</p>
    </div>
  );
};

export default Notification;
