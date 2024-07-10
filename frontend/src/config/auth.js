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
} from "firebase/auth";

export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const userCred = await signInWithPopup(auth, provider);
    console.log("userCred", userCred);

    const isValid = await verifyAuth(userCred.user.email,'','google');
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

export const doSignInWithEmailAndPassword = async (email, password) => {
  try {
    let userCred;
    signInWithEmailAndPassword(auth, email, password)
    .then((user)=>{
      userCred = user
    })
    .catch((error)=>{
      console.log("error here", error);
    })
    //console.log("user cred1", userCred);
    if (userCred) {
      const isValid = await verifyAuth(userCred.user.email, password,'emailPassword');
      if (!isValid) {
        await signOut(auth);
        clearFirebaseLocalStorageDb(); 
        console.log("User email is not verified. Signed out.");
      } else {
        console.log("User email is verified.");
      }
    }
    return userCred;
  } catch (error) {
    clearFirebaseLocalStorageDb();
    console.log("global error",error);
  }
};

export const doSignOut = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Error signing out:", error);
  }
};
