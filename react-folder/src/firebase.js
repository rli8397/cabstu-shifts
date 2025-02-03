import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"
import { getFirestore } from 'firebase/firestore'
import { getMessaging, getToken } from "firebase/messaging";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCTNBY9Y9qkeyLy9XWV0c08Zw13cYHtKLs",
    authDomain: "cabstu-shifts.firebaseapp.com",
    projectId: "cabstu-shifts",
    storageBucket: "cabstu-shifts.firebasestorage.app",
    messagingSenderId: "414137048720",
    appId: "1:414137048720:web:9767d24d0aa95bcad9c215",
    measurementId: "G-6YBHX3GE9G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app);

export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;

