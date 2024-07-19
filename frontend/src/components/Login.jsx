import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdLockOutline, MdInfoOutline, MdClose } from "react-icons/md";
import { IoMail } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./styles.css";
import {
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
  doSignOut,
} from "../config/auth";
import logo from "./../assets/logo/Group3.svg";
//import { useAuth } from "../context/authContext/AuthProvider";
const Login = () => {
  //const {userLoggedIn} = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const location = useLocation();
  const myProp = location.state?.myProp;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showInfoMessage, setShowInfoMessage] = useState(true);
  const navigate = useNavigate();

  const handleCloseInfoMessage = (e) => {
    e.preventDefault();
    setShowInfoMessage(false);
  };

  useEffect(() => {
    if (myProp) {
      console.log("Password reset successful!");
    }
  }, [myProp]);

  useEffect(() => {
    const handlePageRefresh = () => {
      window.history.replaceState(null, null, window.location.pathname);
    };

    window.addEventListener("beforeunload", handlePageRefresh);

    return () => {
      window.removeEventListener("beforeunload", handlePageRefresh);
    };
  }, []);

  const signInWithEmail = async () => {
    doSignInWithEmailAndPassword(email, password)
      .then((signedIn) => {
        console.log("signed in ", signedIn);
        localStorage.setItem("userEmail", email);
        navigate("/navbar");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const signInWithGoogle = async () => {
    const signedIn = await doSignInWithGoogle();
    console.log("hello google");
    localStorage.setItem("userEmail", email);
    if (signedIn) {
      navigate("/navbar");
    }
  };

  return (
    <div className="login-main">
      <div className="login-left-side">
        <div className="login-logo">
          <img src={logo} alt="Logo" />
        </div>
        <div className="login-container">
          {myProp && showInfoMessage === true && (
            <div className="info-message">
              <MdInfoOutline className="info-icon" />
              <span>{myProp}</span>

              <button
                className="info-close-button"
                onClick={handleCloseInfoMessage}
              >
                <MdClose />
              </button>
            </div>
          )}
          <h2>Login to EASY</h2>
          <div className="form-container">
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
              <button
                className="login-submit-button login-buttons"
                onClick={signInWithEmail}
              >
                Sign in
              </button>
              <div className="or">
                <hr />
                <span>OR</span>
                <hr />
              </div>
              <button
                className="social-login google login-buttons"
                onClick={signInWithGoogle}
              >
                Continue with Google
              </button>
              <button className="social-login microsoft login-buttons">
                Continue with Microsoft
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="login-right-side">
        <h3>Welcome to EASY</h3>
        <p>
          Our mission is to simplify your life with our innovative solutions.
        </p>
        <blockquote>
          "EASY has transformed the way we handle our daily tasks. It's truly a
          game-changer!"
          <footer>— Happy Customer</footer>
        </blockquote>
      </div>
    </div>
  );
};

export default Login;
