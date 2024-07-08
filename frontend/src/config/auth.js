import { auth } from "./firebase-config.js";

import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((userCred) => {
      console.log(userCred);
      
      
    })
    .catch((error) => {
      console.log("--------------", error);
    });
  
};

export const doSignOut = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Error signing out:", error);
  }
};

export const doSignInWithEmailAndPassword = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password); // i will change this
};


