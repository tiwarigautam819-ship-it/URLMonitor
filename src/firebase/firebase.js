import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBRL0mvU0wuZrYxGxgpHlPDPETyASv4JhQ",
  authDomain: "urlmonitor-857ac.firebaseapp.com",
  projectId: "urlmonitor-857ac",
  storageBucket: "urlmonitor-857ac.firebasestorage.app",
  messagingSenderId: "548034885167",
  appId: "1:548034885167:web:d8c4a76b915a3d9ad738da"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
