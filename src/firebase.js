import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "helio-admin-db.firebaseapp.com",
  projectId: "helio-admin-db",
  storageBucket: "helio-admin-db.appspot.com",
  messagingSenderId: "475756544311",
  appId: "1:475756544311:web:a28d311af4a05e558a9ab2",
};
console.log("Firebase API Key:", process.env.REACT_APP_FIREBASE_KEY);
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);