import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const vapidKey =
  "BCDTLAY1yjughhgWLBYviuZKvnHWkX_W38oIAHOIFe4ouY6UkWr3PTK3Qrq_trvG5zYlJwSSx6VCO4xnSqqUOso";

const firebaseConfigMessaging = {
  apiKey: "AIzaSyAGUMz8AKBfIZOMqvJ17wsqMqegYz41j4M",
  authDomain: "dealpay-asia.firebaseapp.com",
  projectId: "dealpay-asia",
  storageBucket: "dealpay-asia.appspot.com",
  messagingSenderId: "514391861585",
  appId: "1:514391861585:web:88690c64348b88fad7cb70",
};

let messaging = null;

if (typeof window !== "undefined") {
  const app = initializeApp(firebaseConfig);
  messaging = getMessaging(app);
}

export const requestFMCToken = async () => {
  if (!messaging) return;
  return Notification.requestPermission()
    .then((permission) => {
      if (permission == "granted") {
        return getToken(messaging, { vapidKey });
      } else {
        throw new Error("Notification not Granted");
      }
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
};
