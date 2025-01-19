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

// getToken(messaging, { vapidKey: 'BMnGN9BAOJqwJ5XJLlDWnmIfCqyhhoqbCnfHep-DGeQub689flYWzNka4tt2f8_SNK-PMfBdImEl7psP0JSv6Ys' }).then((currentToken) => {
//   if (currentToken) {
//     // Send the token to your server and update the UI if necessary
//     // ...
//   } else {
//     // Show permission request UI
//     console.log('No registration token available. Request permission to generate one.');
//     // ...
//   }
// }).catch((err) => {
//   console.log('An error occurred while retrieving token. ', err);
//   // ...
// });

export const db = getFirestore(app);

export const auth = getAuth(app);
export default app;