importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

const firebaseConfigMessaging = {
  apiKey: "AIzaSyAGUMz8AKBfIZOMqvJ17wsqMqegYz41j4M",
  authDomain: "dealpay-asia.firebaseapp.com",
  projectId: "dealpay-asia",
  storageBucket: "dealpay-asia.appspot.com",
  messagingSenderId: "514391861585",
  appId: "1:514391861585:web:88690c64348b88fad7cb70",
};

firebase.initializeApp(firebaseConfigMessaging);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.table("=>", payload);
  // Customize notification here
  const notificationTitle = payload.notification.title || "New Notification";
  const notificationOptions = {
    body: payload.notification.body || "You have a new message",
    // icon: "/firebase-logo.png", // Path to an icon if you want to show one
    click_action:
      payload.notification.click_action ||
      "http://localhost:3000/dealpayasia/notification", // URL to open when the notification is clicked
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
