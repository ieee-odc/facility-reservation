import {
  verifyAuth,
  clearFirebaseLocalStorageDb,
} from "../context/authContext/AuthProvider";
import { auth } from "./firebase-config.js";

import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  OAuthProvider
} from "firebase/auth";

export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const userCred = await signInWithPopup(auth, provider);
    console.log("userCred", userCred);

    const isValid = await verifyAuth(userCred.user.email, "", "google");
    if (!isValid) {
      await signOut(auth);
      clearFirebaseLocalStorageDb();
      console.log("User email is not verified. Signed out.");
    } else {
      console.log("User email is verified.");
    }
    return isValid;
  } catch (error) {
    clearFirebaseLocalStorageDb();
    console.log(error);
  }
};
export const doSignInWithMicrosoft = async () => {
 //guidance here
};

export const doSignInWithEmailAndPassword = async (email, password) => {
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    console.log("userCred 1 ",userCred);
    const isValid = await verifyAuth(userCred.user.email, "", 'emailPassword');
    if (!isValid) {
      await signOut(auth);
      clearFirebaseLocalStorageDb();
      console.log("User email is not verified. Signed out.");
    } else {
      console.log("User email is verified.");
    }
    return isValid;
  } catch (error) {
    
  }
};

export const doSignOut = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Error signing out:", error);
  }
};
