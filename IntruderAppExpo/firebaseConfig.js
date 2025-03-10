// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyASpY8Ij9CQGMcAxeQ6oiBew4DQpzcqoj0",
  authDomain: "intruder-detection-2d422.firebaseapp.com",
  projectId: "intruder-detection-2d422",
  storageBucket: "intruder-detection-2d422.firebasestorage.app",
  messagingSenderId: "243402056842",
  appId: "1:243402056842:web:c90c9a29ea948f3d2eb973",
};

// Initialize Firebase
// const app =
//   getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// export const auth = getAuth(app);
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
