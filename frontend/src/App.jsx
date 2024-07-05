import React from "react";
import Login from "./components/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css'
const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
