import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "htg2025-11d33.firebaseapp.com",
  projectId: "htg2025-11d33",
  storageBucket: "htg2025-11d33.firebasestorage.app",
  messagingSenderId: "335713043953",
  appId: "1:335713043953:web:67f4afbe2e5dc57927b050",
  measurementId: "G-B3SK3E49FL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is logged in:", user);
    // User is signed in, you can access user details like:
    // user.uid, user.email, etc.
  } else {
    console.log("No user is logged in");
    // User is signed out
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App db={db} auth={auth}/>
  </React.StrictMode>
);

export { db };

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
