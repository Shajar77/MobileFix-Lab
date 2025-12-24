import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCdIulqguQVUyDlCa6tz_wBDvX795wCSSs",
    authDomain: "mobilefix-19d19.firebaseapp.com",
    projectId: "mobilefix-19d19",
    storageBucket: "mobilefix-19d19.firebasestorage.app",
    messagingSenderId: "693426353894",
    appId: "1:693426353894:web:29b6887383b6261f81ed27",
    measurementId: "G-PZ2QXCD1ED"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
