import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../config/firebase-config.js";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const clearFirebaseLocalStorageDb = () => {
  const dbName = "firebaseLocalStorageDb";
  const request = indexedDB.deleteDatabase(dbName);

  request.onsuccess = () => {
    console.log(`${dbName} successfully deleted`);
  };

  request.onerror = (event) => {
    console.error(`Failed to delete ${dbName}:`, event);
  };

  request.onblocked = () => {
    console.warn(`Deletion of ${dbName} is blocked`);
  };
};

export const verifyAuth = async (email,password, method) => {
  try {
    const res = await axios.post(
      "http://localhost:5000/api/reservationInitiators/verify-user",
      { email, password,method }
    );
    console.log("res auth provider", res.data);
    return res.data.isValid;
  } catch (error) {
    console.error("Error verifying user:", error);
    return false;
  }
};

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const isValid = await verifyAuth(user.email,'' ,'any');
        if (isValid) {
          setCurrentUser(user);
          setUserLoggedIn(true);
        } else {
          setCurrentUser(null);
          setUserLoggedIn(false);
        }
      } else {
        setCurrentUser(null);
        setUserLoggedIn(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userLoggedIn,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
