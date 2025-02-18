import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBHBsELK0KNHrAfssgEq8yy45IBaS3hAAk",
  authDomain: "osqe-4a3bb.firebaseapp.com",
  projectId: "osqe-4a3bb",
  storageBucket: "osqe-4a3bb.firebasestorage.app",
  messagingSenderId: "576825446301",
  appId: "1:576825446301:web:e7b9eaa32106c79e57a974",
  measurementId: "G-MS8YXM7RJ8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage }; 