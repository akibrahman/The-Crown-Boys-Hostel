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
  console.log("=>", payload);
});
messaging.on;
