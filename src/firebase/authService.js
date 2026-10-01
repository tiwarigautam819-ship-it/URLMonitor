import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "firebase/firestore";

import { auth, googleProvider, db } from "./firebase";

export const registerUser = async (email, password) => {
  const result = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  await setDoc(
    doc(db, "users", result.user.uid),
    {
      email: result.user.email,
      isPro: false,
      createdAt: serverTimestamp()
    },
    { merge: true }
  );

  return result.user;
};

export const loginUser = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const loginWithGoogle = async () => {
  const result = await signInWithPopup(
    auth,
    googleProvider
  );

  const userRef = doc(db, "users", result.user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    await setDoc(userRef, {
      email: result.user.email,
      name: result.user.displayName || "",
      isPro: false,
      createdAt: serverTimestamp()
    });
  } else {
    await setDoc(
      userRef,
      {
        email: result.user.email,
        name: result.user.displayName || ""
      },
      { merge: true }
    );
  }

  return result.user;
};

export const logoutUser = () => signOut(auth);

export const getUserProfile = async (uid) => {
  const snapshot = await getDoc(
    doc(db, "users", uid)
  );

  if (!snapshot.exists()) {
    return {
      isPro: false
    };
  }

  return snapshot.data();
};

export { onAuthStateChanged };
