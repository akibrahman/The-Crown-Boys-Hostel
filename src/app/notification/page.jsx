"use client";

import useFcmToken from "@/hooks/useFcmToken";

export default function Home() {
  const { token, notificationPermissionStatus } = useFcmToken();

  const handleTestNotification = async () => {
    const response = await fetch("/api/notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        title: "Test Notification",
        message: "This is a test notification",
        link: "/contact",
      }),
    });

    const data = await response.json();
    console.log(data);
  };

  return (
    <main className="p-10">
      <h1 className="text-4xl mb-4 font-bold">Firebase Cloud Messaging Demo</h1>

      {notificationPermissionStatus === "granted" ? (
        <p>Permission to receive notifications has been granted.</p>
      ) : notificationPermissionStatus !== null ? (
        <p>
          You have not granted permission to receive notifications. Please
          enable notifications in your browser settings.
        </p>
      ) : null}

      <button
        disabled={!token}
        className="mt-5 bg-green-500 px-5 py-1 rounded-full font-semibold text-white"
        onClick={handleTestNotification}
      >
        Send Test Notification
      </button>
      <p className="mt-10 p-8 bg-blue-100 border border-blue-500 rounded-md text-wrap text-xs">
        {token}
      </p>
    </main>
  );
}
