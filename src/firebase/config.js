import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCnPk_9FQjn-5EupcxoXrR3SwkyBLsPkCs",
    authDomain: "dream-city-roleplay-s2.firebaseapp.com",
    projectId: "dream-city-roleplay-s2",
    storageBucket: "dream-city-roleplay-s2.firebasestorage.app",
    messagingSenderId: "888038204856",
    appId: "1:888038204856:web:3afb58d50b71c47250db4d",
    measurementId: "G-XSQKZFQK5X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;