import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../config/firebase-config.js";
import axios from "axios";
const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const verifyAuth = async (email) => {
  try {
    const res = await axios.post("http://localhost:5000/verify-user", {
      email,
    });
    console.log("res auth provider", res);
    //return res.data.isValid;
  } catch (error) {
    console.error("Error verifying user:", error);
    return false;
  }
};

const AuthProvider = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [isEmailUser, setIsEmailUser] = useState(false);
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);

  async function initializeUser(user) {
    const isValid = await verifyAuth(user.email);
    if (isValid) {
      setCurrentUser({ ...user });
      setUserLoggedIn(true);
    } else {
      setCurrentUser(null);
      setUserLoggedIn(false);
    }
    setLoading(false);
  }

  const value = {
    currentUser,
    userLoggedIn,
    loading,
  };

  return value;
};

export default AuthProvider;
