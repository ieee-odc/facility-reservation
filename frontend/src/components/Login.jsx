import React, { useState } from "react";
import axios from "axios";
import { MdLockOutline } from "react-icons/md";
import { IoMail } from "react-icons/io5";
import { Link } from "react-router-dom";
import "./styles.css";
import { doSignInWithEmailAndPassword, doSignInWithGoogle, doSignOut } from "../config/auth";
//import { useAuth } from "../context/authContext/AuthProvider"; 
const Login = () => {
  //const {userLoggedIn} = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  
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
            <Link to="/reset-password">Forgot password?</Link>
          </div>
          <button className="login-submit-button login-buttons" onClick={doSignOut}>
            Sign in
          </button>
          <div className="or">
            <hr />
            <span>OR</span>
            <hr />
          </div>
          <button 
            className="social-login google login-buttons"
            onClick={doSignInWithGoogle}
            >
            Continue with Google
          </button>
          <button 
            className="social-login microsoft login-buttons"
            >
            Continue with Microsoft
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
