import { verifyAuth } from "../context/authContext/AuthProvider";
import { auth } from "./firebase-config.js";

import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
} from "firebase/auth";

export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const userCred = await signInWithPopup(auth, provider);
    console.log("userCred", userCred);

    const isValid = await verifyAuth(userCred.user.email);
    if (!isValid) {
      await signOut(auth);
      console.log("User email is not verified. Signed out.");
    } else {
      console.log("User email is verified.");
    }
    return isValid;
  } catch (error) {
    console.log(error);
  }
};

export const doSignInWithEmailAndPassword = async (email, password) => {
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    console.log('user cred1', userCred);
    return userCred;
  } catch (error) {
    console.log(error);
  }
  /*.then((userCred)=>{
    console.log("userCred 1",userCred);
    return userCred;
  })
  .catch((error)=>{
    console.log(error);
    const errorMessage = JSON.stringify(error);
    localStorage.setItem('errorMessage', errorMessage)
  })*/
};

export const doSignOut = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Error signing out:", error);
  }
};
