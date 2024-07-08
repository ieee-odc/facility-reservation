import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../config/firebase-config.js";
const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const verifyAuth = async () => {
  const res = await axios.get('http://localhost:5000/verify-user');
  console.log(res);
}

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
    if (user) {
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

  return (
    value
  );
};

export default AuthProvider;