// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBkMIpD49Md6ErHbkXmRWglh9yKWbHZU2Y",
  authDomain: "the-crown-boys-hostel.firebaseapp.com",
  projectId: "the-crown-boys-hostel",
  storageBucket: "the-crown-boys-hostel.appspot.com",
  messagingSenderId: "495269720543",
  appId: "1:495269720543:web:e0448001f03e2f2975146a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { app, storage };
