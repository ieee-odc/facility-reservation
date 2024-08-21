import React, { useState, useEffect } from "react";
import { MdLockOutline, MdInfoOutline, MdClose, MdOutlineEmail } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useNotification } from ".././context/NotificationContext";
import "./styles.css";
import {
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
  doSignInWithMicrosoft
} from "../config/auth";
import logo from "./../assets/logo/Group3.svg";

const Login = () => {
  const blockquoteStyle = {
    fontStyle: "italic",
    margin: "0",
    padding: "10px 20px",
    borderLeft: "5px solid rgba(255, 255, 255, 0.7)",
    background: "rgba(255, 255, 255, 0.1)",
  };

  const footerStyle = {
    marginTop: "10px",
    fontSize: "14px",
    color: "rgba(255, 255, 255, 0.7)",
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const location = useLocation();
  const [signedIn, setSignedIn] = useState("");
  const myProp = location.state?.myProp;
  const [showInfoMessage, setShowInfoMessage] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const navigate = useNavigate();
  const showNotification = useNotification();

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
    console.log("i am here");

    const signed = await doSignInWithEmailAndPassword(email, password);
    localStorage.setItem("userEmail", email);
    if (signed && !signedIn) {
      setSignedIn(signed);
      navigate("/profile");
    } else {
      showNotification(
        "Incorrect email or password. Please try again.",
        "error"
      );
    }
    /*.then((signedIn) => {
        console.log("signed in ", signedIn);
        localStorage.setItem("userEmail", email);
        navigate("/profile");
      })  
      .catch((error) => {
        console.log(error);
        showNotification("Incorrect email or password. Please try again.", "error");
        console.log("error");
      });*/
  };

  const signInWithGoogle = async () => {
    const signed = await doSignInWithGoogle();
    console.log("hello google");
    localStorage.setItem("userEmail", email);
    if (signed && !signedIn) {
      setSignedIn(signed);
      navigate("/profile");
    } else {
      showNotification("Failed to sign in with Google.", "error");
    }
  };

  const signInWithMicrosoft = async () => {
    const signed = await doSignInWithMicrosoft();
    console.log("hello microsoft");
    localStorage.setItem("userEmail", email);
    if (signed && !signedIn) {
      setSignedIn(signed);
      navigate("/profile");
    } else {
      showNotification("Failed to sign in with Microsoft.", "error");
    }
  }

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setIsEmailValid(validateEmail(value));
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
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
          <h2>Welcome to FlexiSpace</h2>
          <div className="form-container">
            <div className="inputs-container">
              <div className="input-container">
                <div className="icon-box">
                  <MdOutlineEmail className="input-icon" />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    className="input-with-icon"
                    onChange={handleEmailChange}
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
                disabled={!email || !password || !isEmailValid}
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
              <button
                className="social-login microsoft login-buttons"
                onClick={signInWithMicrosoft}
              >
                Continue with Microsoft
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="login-right-side">
        <h3>Welcome to FlexiSpace</h3>
        <p>
          Our mission is to simplify your life with our innovative solutions.
        </p>
        <blockquote style={blockquoteStyle}>
          "FlexiSpace has transformed the way we handle our daily tasks. It's
          truly a game-changer!"
          <footer style={footerStyle}>— Happy Customer</footer>
        </blockquote>
      </div>
    </div>
  );
};

export default Login;
