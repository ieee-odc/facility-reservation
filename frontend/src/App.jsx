import React from "react";
import Login from "./components/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ResetPassword from "./components/ResetPassword";
import AuthProvider from "./context/authContext/AuthProvider.js";
import "./App.css";

const App = () => {
  const { currentUser, userLoggedIn, loading } = AuthProvider();
  console.log(currentUser, userLoggedIn, loading);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
