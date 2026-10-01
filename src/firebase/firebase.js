import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBRL0mvZrYxGxgpHlPDPETyASv4JhQ",
  authDomain: "urlmonitor-857ac.firebaseapp.com",
  projectId: "urlmonitor-857ac",
  storageBucket: "urlmonitor-857ac.firebasestorage.app",
  messagingSenderId: "548034885167",
  appId: "1:548034885167:web:fd5eb1a3a4f2108fd738da"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
