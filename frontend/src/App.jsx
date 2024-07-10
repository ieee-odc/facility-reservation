import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import AuthProvider, { useAuth } from "./context/authContext/AuthProvider";
import Login from "./components/Login";
import ResetPassword from "./components/ResetPassword";
import Navbar from "./components/navbar";
import "./App.css";

const AuthStatus = () => {
  const { currentUser, userLoggedIn, loading } = useAuth();

  useEffect(() => {
    console.log(currentUser, userLoggedIn, loading);
  }, [currentUser, userLoggedIn, loading]);

  return null;
};

console.log("afwan"+process.env.REACT_APP_FIREBASE_APP_ID);

const AppRoutes = () => {
  const { userLoggedIn } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/navbar" element={<Navbar/>} />

      {userLoggedIn ? (
        <Route path="/reset-password" element={<ResetPassword />} />

      ) : (
        <Route path="*" element={<Navigate to="/login" />} />
      )}
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AuthStatus />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
