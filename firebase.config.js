// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getStorage } from "firebase/storage";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBkMIpD49Md6ErHbkXmRWglh9yKWbHZU2Y",
//   authDomain: "the-crown-boys-hostel.firebaseapp.com",
//   projectId: "the-crown-boys-hostel",
//   storageBucket: "the-crown-boys-hostel.appspot.com",
//   messagingSenderId: "495269720543",
//   appId: "1:495269720543:web:e0448001f03e2f2975146a",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const storage = getStorage(app);

// export { app, storage };

import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";
import { getStorage } from "firebase/storage";

// Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBkMIpD49Md6ErHbkXmRWglh9yKWbHZU2Y",
  authDomain: "the-crown-boys-hostel.firebaseapp.com",
  projectId: "the-crown-boys-hostel",
  storageBucket: "the-crown-boys-hostel.appspot.com",
  messagingSenderId: "495269720543",
  appId: "1:495269720543:web:e0448001f03e2f2975146a",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const storage = getStorage(app);

const messaging = async () => {
  const supported = await isSupported();
  return supported ? getMessaging(app) : null;
};

export const fetchToken = async () => {
  try {
    const fcmMessaging = await messaging();
    if (fcmMessaging) {
      const token = await getToken(fcmMessaging, {
        vapidKey: process.env.FIREBASE_FCM_VAPID_KEY,
      });
      return token;
    }
    return null;
  } catch (err) {
    console.error("An error occurred while fetching the token:", err);
    return null;
  }
};

export { app, messaging, storage };
