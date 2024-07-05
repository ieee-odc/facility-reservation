import React, { useState } from "react";
import axios from "axios";
import { MdLockOutline } from "react-icons/md";
import { IoMail } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import "./styles.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { email, password };

      const response = await axios.post(
        "http://localhost:5000/api/reservationInitiators/login",
        data
      );
      console.log(response);

      if (response.status[0] === 2) {
        console.log("checked");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="login-container">
      <h2>Member login</h2>
      <form className="form-container">
        <div className="inputs-container">
          <div className="input-container">
            <div className="icon-box">
              <IoMail className="input-icon" />
              <input
                type="email"
                placeholder="Email"
                required
                className="input-with-icon"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="input-container">
            <div className="icon-box">
              <MdLockOutline className="input-icon" />
              <input
                type="password"
                placeholder="Password"
                required
                className="input-with-icon"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="forgot-password-link">
            <a href="#">Forgot password?</a>
          </div>
          <button className="login-submit-button login-buttons" type="submit">
            Sign in
          </button>
          <div className="or">
            <hr />
            <span>OR</span>
            <hr />
          </div>
          <button className="social-login google login-buttons ">
            Continue with Google
          </button>
          <button className="social-login microsoft login-buttons">
            Continue with Microsoft
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
