// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0ryU6jI-jgj9LROOAsAFGxikn7LgwNVo",
  authDomain: "react-poke-app-b54fd.firebaseapp.com",
  projectId: "react-poke-app-b54fd",
  storageBucket: "react-poke-app-b54fd.firebasestorage.app",
  messagingSenderId: "414927302264",
  appId: "1:414927302264:web:a6f36a451aa5f4d7a0878d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app