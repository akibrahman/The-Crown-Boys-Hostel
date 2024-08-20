import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import { firebaseConfig } from "./firebaseConfig.js";

const vapidKey =
  "BCDTLAY1yjughhgWLBYviuZKvnHWkX_W38oIAHOIFe4ouY6UkWr3PTK3Qrq_trvG5zYlJwSSx6VCO4xnSqqUOso";

const app = initializeApp(firebaseConfig);

const messaging = getMessaging(app);

export const requestFMCToken = async () => {
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
