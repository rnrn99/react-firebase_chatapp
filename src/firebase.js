// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/compat/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAm35JoHBZLb-S9AoVbUwKBKQwPoXqWnYg",
  authDomain: "react-chatapp-c24bd.firebaseapp.com",
  projectId: "react-chatapp-c24bd",
  storageBucket: "react-chatapp-c24bd.appspot.com",
  messagingSenderId: "771252161216",
  appId: "1:771252161216:web:5c7c9fb85875dfd659bb25",
  measurementId: "G-KPGQ053B26",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
